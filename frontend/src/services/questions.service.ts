import api from './api';

export interface Question {
  _id: string;
  title: string;
  content: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  author: {
    _id: string;
    name: string;
    email: string;
  };
  answers: any[];
  likeCount: number;
  createdAt: string;
}

export const getNearbyQuestions = async (latitude: number, longitude: number, maxDistance: number = 10000) => {
  const response = await api.get<Question[]>('/questions', {
    params: {
      latitude,
      longitude,
      maxDistance,
    },
  });
  return response.data;
};

export const createQuestion = async (data: { title: string; content: string; latitude: number; longitude: number }) => {
  const response = await api.post<Question>('/questions', data);
  return response.data;
};

export const likeQuestion = async (questionId: string) => {
    const response = await api.post(`/users/favorites/${questionId}`);
    return response.data;
};

export const unlikeQuestion = async (questionId: string) => {
    const response = await api.delete(`/users/favorites/${questionId}`);
    return response.data;
};

export const getFavoriteQuestions = async () => {
    const response = await api.get<{ favorites: Question[] }>('/users/favorites');
    return response.data.favorites;
};
