'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { User, Mail, Phone, MapPin, Briefcase, Star, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

export default function TechnicianProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    experienceYrs: '',
    location: '',
    phone: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        // Fetch technician profile using the correct endpoint
        const response = await api.get('/technicians/profile');

        if (response.data.success) {
          const tech = response.data.data;
          setProfile(tech);
          setFormData({
            bio: tech.bio || '',
            experienceYrs: tech.experienceYrs?.toString() || '',
            location: tech.location || '',
            phone: tech.user?.phone || user?.phone || '',
          });
        } else {
          toast.error('Failed to load profile');
        }
      } catch (error: any) {
        console.error('Profile load error:', error);
        toast.error(error.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadProfile();
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      // Update technician profile
      const response = await api.put('/technicians/profile', {
        bio: formData.bio,
        experienceYrs: parseInt(formData.experienceYrs) || 0,
        location: formData.location,
      });

      if (response.data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);

        // Refresh profile
        const refreshResponse = await api.get('/technicians/profile');
        if (refreshResponse.data.success) {
          setProfile(refreshResponse.data.data);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-64 rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>
        {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell customers about yourself..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Experience (Years)</label>
                    <Input
                      type="number"
                      value={formData.experienceYrs}
                      onChange={(e) => setFormData({ ...formData, experienceYrs: e.target.value })}
                      placeholder="5"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Dhaka, Bangladesh"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdate}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      {user?.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{user?.name}</h3>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user?.email}
                      </p>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {formData.phone || 'No phone number'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 border-t pt-4">
                    <div>
                      <p className="text-sm font-medium">Bio</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.bio || 'No bio provided'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-sm font-medium">Experience</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.experienceYrs || 0} years
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.location || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-sm font-medium">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{profile?.avgRating || 0}</span>
                          <span className="text-sm text-muted-foreground">
                            ({profile?.totalReviews || 0} reviews)
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Member Since</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Services</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.services?.length || 0} services
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Rating</p>
                  <p className="text-sm text-muted-foreground">{profile?.avgRating || 0} / 5</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Reviews</p>
                  <p className="text-sm text-muted-foreground">{profile?.totalReviews || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Joined</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
