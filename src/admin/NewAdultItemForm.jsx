// src/admin/NewAdultItemForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import './NewItemForm.css';

export default function NewAdultItemForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Title: '',
    CurrentPrice: '',
    Year: '',
    Quantity: '',
    Description: '',
    PosterURL: '',
    Disc: '',
    Type: '',
    Genres: '',
    Director: '',
    Cast: '',
  });
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase
      .storage
      .from('posters')
      .upload(fileName, file);
    if (error) {
      setError(error.message);
    } else {
      const { publicUrl } = supabase
        .storage
        .from('posters')
        .getPublicUrl(data.path);
      setForm(f => ({ ...f, PosterURL: publicUrl }));
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newItem = {
      Title: form.Title,
      CurrentPrice: parseFloat(form.CurrentPrice),
      ['Release Year']: form.Year,
      QtyToList: parseInt(form.Quantity, 10),
      Description: form.Description,
      PosterURL: form.PosterURL,
      Disc: form.Disc,
      Type: form.Type,
      Genres: form.Genres,
      Director: form.Director,
      Cast: form.Cast,
      // AdultSerialNo will be auto‐assigned by the DB sequence
    };

    const { error: insertError } = await supabase
      .from('Adult_titles')
      .insert([newItem]);

    if (insertError) {
      setError(insertError.message);
    } else {
      navigate('/admin/adult/items', { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="edit-form-container">
      <h2>Add New Adult Movie</h2>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit} className="edit-form">
        {/* Title */}
        <div className="form-row">
          <label>Title</label>
          <input
            name="Title"
            value={form.Title}
            onChange={onChange}
            required
          />
        </div>
        {/* Price */}
        <div className="form-row">
          <label>Price ($)</label>
          <input
            type="number"
            name="CurrentPrice"
            step="0.01"
            value={form.CurrentPrice}
            onChange={onChange}
            required
          />
        </div>
        {/* Release Year */}
        <div className="form-row">
          <label>Release Year</label>
          <input
            name="Year"
            value={form.Year}
            onChange={onChange}
          />
        </div>
        {/* Quantity */}
        <div className="form-row">
          <label>Quantity</label>
          <input
            type="number"
            name="Quantity"
            value={form.Quantity}
            onChange={onChange}
          />
        </div>
        {/* Description */}
        <div className="form-row">
          <label>Description</label>
          <textarea
            name="Description"
            rows="4"
            value={form.Description}
            onChange={onChange}
          />
        </div>
        {/* Disc */}
        <div className="form-row">
          <label>Disc</label>
          <input
            name="Disc"
            value={form.Disc}
            onChange={onChange}
          />
        </div>
        {/* Type */}
        <div className="form-row">
          <label>Type</label>
          <input
            name="Type"
            value={form.Type}
            onChange={onChange}
          />
        </div>
        {/* Genres */}
        <div className="form-row">
          <label>Genres</label>
          <input
            name="Genres"
            value={form.Genres}
            onChange={onChange}
          />
        </div>
        {/* Director */}
        <div className="form-row">
          <label>Director</label>
          <input
            name="Director"
            value={form.Director}
            onChange={onChange}
          />
        </div>
        {/* Cast */}
        <div className="form-row">
          <label>Cast</label>
          <input
            name="Cast"
            value={form.Cast}
            onChange={onChange}
          />
        </div>
        {/* Poster Upload */}
        <div className="form-row">
          <label>Poster Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
          {uploading && <small>Uploading…</small>}
          {form.PosterURL && (
            <img
              src={form.PosterURL}
              alt="Poster preview"
              className="poster-preview"
            />
          )}
        </div>
        {/* Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding…' : 'Add Movie'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/adult/items')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
