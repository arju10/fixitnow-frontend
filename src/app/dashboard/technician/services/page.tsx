'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useServices } from '@/hooks/useServices';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function TechnicianServicesPage() {
  const { services, loading, fetchServices, createService, updateService, deleteService } =
    useServices();
  const { categories } = useCategories();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    durationMins: '',
    categoryId: '',
  });

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleCreate = async () => {
    if (!formData.title || !formData.price || !formData.categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createService({
        ...formData,
        price: parseFloat(formData.price),
        durationMins: parseInt(formData.durationMins) || 60,
      });
      setIsCreating(false);
      setFormData({ title: '', description: '', price: '', durationMins: '', categoryId: '' });
    } catch (error) {
      toast.error('Failed to create service');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.title || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await updateService(id, {
        ...formData,
        price: parseFloat(formData.price),
        durationMins: parseInt(formData.durationMins) || 60,
      });
      setEditingId(null);
      setFormData({ title: '', description: '', price: '', durationMins: '', categoryId: '' });
    } catch (error) {
      toast.error('Failed to update service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteService(id);
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const startEdit = (service: any) => {
    setEditingId(service.id);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      price: service.price?.toString() || '',
      durationMins: service.durationMins?.toString() || '',
      categoryId: service.categoryId || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', price: '', durationMins: '', categoryId: '' });
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">My Services</h1>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        )}
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create New Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Title *</label>
                  <Input
                    placeholder="e.g., Leak Repair"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category *</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price ($) *</label>
                  <Input
                    type="number"
                    placeholder="45"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    placeholder="60"
                    value={formData.durationMins}
                    onChange={(e) => setFormData({ ...formData, durationMins: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your service..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreate}>Create Service</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setFormData({
                      title: '',
                      description: '',
                      price: '',
                      durationMins: '',
                      categoryId: '',
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted/50" />
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-4">
                {editingId === service.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title *</label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category *</label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={formData.categoryId}
                          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                          <option value="">Select Category</option>
                          {categoryOptions.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Price ($) *</label>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Duration (minutes)</label>
                        <Input
                          type="number"
                          value={formData.durationMins}
                          onChange={(e) =>
                            setFormData({ ...formData, durationMins: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdate(service.id)}>
                        <Check className="mr-1 h-4 w-4" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="mr-1 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{service.title}</h3>
                        <Badge variant={service.isActive ? 'success' : 'destructive'}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {service.category?.name} • {service.durationMins} min
                      </p>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {service.description || 'No description'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(service.price)}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(service)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border py-12 text-center">
          <p className="text-lg text-muted-foreground">No services yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first service to get started
          </p>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
