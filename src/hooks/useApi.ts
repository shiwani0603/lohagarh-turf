'use client';

import { useCallback } from 'react';
import apiClient from '@/utils/apiClient';

export const useApi = () => {
  const get = useCallback(async (url: string) => {
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }, []);

  const post = useCallback(async (url: string, data: any) => {
    try {
      const response = await apiClient.post(url, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }, []);

  const put = useCallback(async (url: string, data: any) => {
    try {
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }, []);

  const delete_ = useCallback(async (url: string) => {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }, []);

  return { get, post, put, delete_ };
};
