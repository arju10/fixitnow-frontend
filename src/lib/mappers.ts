/**
 * Maps backend technician data to frontend format
 */
export const mapTechnician = (data: any) => {
  return {
    id: data.id,
    userId: data.userId,
    user: {
      id: data.user?.id,
      name: data.user?.name,
      email: data.user?.email,
      phone: data.user?.phone,
      profileImage: data.user?.profileImage,
    },
    bio: data.bio,
    experienceYrs: data.experienceYrs,
    location: data.location,
    avgRating: data.avgRating || 0,
    totalReviews: data.totalReviews || 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    services: data.services?.map(mapService) || [],
    availability: data.availability || [],
    reviews: data.reviews || [],
  };
};

export const mapService = (data: any) => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    price: data.price,
    durationMins: data.durationMins,
    isActive: data.isActive,
    categoryId: data.categoryId,
    category: data.category,
    technician: data.technician ? mapTechnician(data.technician) : undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const mapBooking = (data: any) => {
  return {
    id: data.id,
    customerId: data.customerId,
    technicianId: data.technicianId,
    serviceId: data.serviceId,
    scheduledAt: data.scheduledAt,
    status: data.status,
    totalAmount: data.totalAmount,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    customer: data.customer,
    technician: data.technician,
    service: data.service ? mapService(data.service) : undefined,
    payment: data.payment,
    review: data.review,
  };
};

export const mapAvailability = (data: any) => {
  return {
    id: data.id,
    technicianId: data.technicianId,
    dayOfWeek: data.dayOfWeek,
    startTime: data.startTime,
    endTime: data.endTime,
    isActive: data.isActive,
    createdAt: data.createdAt,
  };
};
