 // react-query or SWR hooks for fetch/mutate

 /* src/admin/useAdminData.js */
import { useState, useEffect, useCallback } from 'react';
import supabase from '../supabaseClient';

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('Regular_titles').select('*');
    if (error) setError(error);
    else setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);
  return { items, loading, error, refetch: fetchItems };
}

export function useCreateItem() {
  return useCallback(async (item) => {
    const { error } = await supabase.from('Regular_titles').insert(item);
    if (error) throw error;
  }, []);
}

export function useUpdateItem() {
  return useCallback(async (id, updates) => {
    const { error } = await supabase.from('Regular_titles').update(updates).eq('id', id);
    if (error) throw error;
  }, []);
}

export function useDeleteItem() {
  return useCallback(async (id) => {
    const { error } = await supabase.from('Regular_titles').delete().eq('id', id);
    if (error) throw error;
  }, []);
}