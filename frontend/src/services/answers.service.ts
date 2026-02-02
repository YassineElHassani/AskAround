import api from './api';

export interface Answer {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export const getAnswers = async (questionId: string) => {
  const response = await api.get<Answer[]>(`/answers/question/${questionId}`);
  return response.data;
};

export const createAnswer = async (questionId: string, content: string) => {
  const response = await api.post<Answer>('/answers', { questionId, content });
  return response.data;
};

export const getQuestionById = async (id: string) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
}
