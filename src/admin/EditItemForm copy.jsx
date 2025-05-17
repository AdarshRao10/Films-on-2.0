// src/components/EditItemForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import './EditItemForm.css';

export default function EditItemForm() {
  // Grab either RegSerialNo or AdultSerialNo from the URL
  const { RegSerialNo, AdultSerialNo } = useParams();
  const isAdult = !!AdultSerialNo;
  const serialParam = isAdult ? AdultSerialNo : RegSerialNo;
  const id = parseInt(serialParam, 10);

  const navigate = useNavigate();

  // Shared form state, with both sets of fields
  const [form, setForm] = useState({
    // Regular fields
    Title: '',
    CurrentPrice: '',
    Year: '',
    QtyToList: '',
    Disc: '',
    Type: '',
    Genres: '',
    Director: '',
    Cast: '',
    Description: '',
    // Adult fields
    Condition: '',
    Price: '',
    Quantity: '',
    Production: '',
    ReleaseDate: '',
    // Common
    PosterURL: ''
  });

  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');

  // Determine table name and primary key column
  const tableName = isAdult ? 'Adult_titles' : 'Regular_titles';
  const pkColumn  = isAdult ? 'AdultSerialNo' : 'RegSerialNo';

  // Fetch existing record
  useEffect(() => {
    if (isNaN(id)) return;
    supabase
      .from(tableName)
      .select('*')
      .eq(pkColumn, id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else if (data) {
          // Map data into form state
          setForm({
            Title: data.Title || '',
            CurrentPrice: data.CurrentPrice?.toString() || '',
            Year: data['Release Year'] || '',
            QtyToList: data.QtyToList?.toString() || '',
            Disc: data.Disc || '',
            Type: data.Type || '',
            Genres: data.Genres || '',
            Director: data.Director || '',
            Cast: data.Cast || '',
            Description: data.Description || '',
            Condition: data.Condition || '',
            Price: data.Price?.toString() || '',
            Quantity: data.Quantity?.toString() || '',
            Production: data.Production || '',
            ReleaseDate: data['Release Date'] || '',
            PosterURL: data.PosterURL || ''
          });
        }
      });
  }, [id, isAdult]);

  // Handle text inputs
  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Handle poster uploads
  const onFileChange = async e => {
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

  // Submit updates
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    // Build update payload
    let updates = {};
    if (isAdult) {
      updates = {
        Title: form.Title,
        Condition: form.Condition,
        Price: parseFloat(form.Price),
        Quantity: parseInt(form.Quantity, 10),
        Production: form.Production,
        ['Release Date']: form.ReleaseDate,
        PosterURL: form.PosterURL
      };
    } else {
      updates = {
        Title: form.Title,
        CurrentPrice: parseFloat(form.CurrentPrice),
        ['Release Year']: form.Year,
        QtyToList: parseInt(form.QtyToList, 10),
        Disc: form.Disc,
        Type: form.Type,
        Genres: form.Genres,
        Director: form.Director,
        Cast: form.Cast,
        Description: form.Description,
        PosterURL: form.PosterURL
      };
    }

    const { error: updateError } = await supabase
      .from(tableName)
      .update(updates)
      .eq(pkColumn, id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      // Redirect back to the correct admin list
      navigate(isAdult ? '/admin/adult/items' : '/admin/items', { replace: true });
    }
  };

  return (
    <div className="edit-form-container">
      <h2>
        Edit {isAdult ? 'Adult' : 'Regular'} Movie #{serialParam}
      </h2>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="edit-form">
        {/* Common Title */}
        <div className="form-row">
          <label>Title</label>
          <input
            name="Title"
            value={form.Title}
            onChange={onChange}
            required
          />
        </div>

        {isAdult ? (
          // Adult-only fields
          <>
            <div className="form-row">
              <label>Condition</label>
              <input
                name="Condition"
                value={form.Condition}
                onChange={onChange}
              />
            </div>
            <div className="form-row">
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="Price"
                value={form.Price}
                onChange={onChange}
              />
            </div>
            <div className="form-row">
              <label>Quantity</label>
              <input
                type="number"
                name="Quantity"
                value={form.Quantity}
                onChange={onChange}
              />
            </div>
            <div className="form-row">
              <label>Production</label>
              <input
                name="Production"
                value={form.Production}
                onChange={onChange}
              />
            </div>
            <div className="form-row">
              <label>Release Date</label>
              <input
                name="ReleaseDate"
                value={form.ReleaseDate}
                onChange={onChange}
              />
            </div>
          </>
        ) : (
          // Regular-only fields
          <>
            <div className="form-row">
              <label>Current Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="CurrentPrice"
                value={form.CurrentPrice}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-row">
              <label>Release Year</label>
              <input
                name="Year"
                value={form.Year}
                onChange={onChange}
              />
            </div>
            <div className="form-row">
              <label>Qty To List</label>
              <input
                type="number"
                name="QtyToList"
                value={form.QtyToList}
                onChange={onChange}
              />
            </div>
            <div className="form-row">
              <label>Disc</label>
              <input
                name="Disc"
                value={form.Disc}
                onChange={onChange}
              />
            </div>
            <div className="form-row">
              <label>Type</label>
              <input
                name="Type"
                value={form.Type}
                onChange={onChange}
              />
            </div>
            <div className="form-row">
              <label>Genres</label>
              <input
                name="Genres"
                value={form.Genres}
                onChange={onChange}
              />
            </div>
            <div className="form-row">
              <label>Director</label>
              <input
                name="Director"
                value={form.Director}
                onChange={onChange}
              />
            </div>
            <div className="form-row">
              <label>Cast</label>
              <input
                name="Cast"
                value={form.Cast}
                onChange={onChange}
              />
            </div>
            <div className="form-row">
              <label>Description</label>
              <textarea
                name="Description"
                rows="3"
                value={form.Description}
                onChange={onChange}
              />
            </div>
          </>
        )}

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
              alt="Preview"
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
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(isAdult ? '/admin/adult/items' : '/admin/items')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}




// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import supabase from '../supabaseClient';
// import './EditItemForm.css';

// export default function EditItemForm() {
//   const { RegSerialNo } = useParams();          // now named RegSerialNo
  
//   const id = parseInt(RegSerialNo, 10);
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     Title: '',
//     CurrentPrice: '',
//     Year: '',
//     Quantity: '',
//     Description: '',
//     PosterURL: '',
//     Disc: '',
//     Type: '',
//     Genres: '',
//     Director: '',
//     Cast: ''
//   });
//   const [loading, setLoading]     = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError]         = useState('');

//   useEffect(() => {
//     if (isNaN(id)) return;
//     supabase
//       .from('Regular_titles')
//       .select('*')
//       .eq('RegSerialNo', id)
//       .single()
//       .then(({ data, error }) => {
//         if (error) setError(error.message);
//         else setForm({
//           Title: data.Title || '',
//           CurrentPrice: data.CurrentPrice?.toString() || '',
//           Year: data['Release Year'] || '',
//           Quantity: data.QtyToList?.toString() || '',
//           Description: data.Description || '',
//           PosterURL: data.PosterURL || '',
//           Disc: data.Disc || '',
//           Type: data.Type || '',
//           Genres: data.Genres || '',
//           Director: data.Director || '',
//           Cast: data.Cast || ''
//         });
//       });
//   }, [id]);

//   const onChange = e => {
//     const { name, value } = e.target;
//     setForm(f => ({ ...f, [name]: value }));
//   };

//   const onFileChange = async e => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setUploading(true);
//     const fileName = `${Date.now()}_${file.name}`;
//     const { data, error } = await supabase.storage
//       .from('posters')
//       .upload(fileName, file);
//     if (error) setError(error.message);
//     else {
//       const { publicUrl } = supabase.storage
//         .from('posters')
//         .getPublicUrl(data.path);
//       setForm(f => ({ ...f, PosterURL: publicUrl }));
//     }
//     setUploading(false);
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);
//     const updates = {
//       Title: form.Title,
//       CurrentPrice: parseFloat(form.CurrentPrice),
//       ['Release Year']: form.Year,
//       QtyToList: parseInt(form.Quantity, 10),
//       Description: form.Description,
//       PosterURL: form.PosterURL,
//       Disc: form.Disc,
//       Type: form.Type,
//       Genres: form.Genres,
//       Director: form.Director,
//       Cast: form.Cast
//     };
//     const { error: updateError } = await supabase
//       .from('Regular_titles')
//       .update(updates)
//       .eq('RegSerialNo', id);
//     if (updateError) {
//       setError(updateError.message);
//       setLoading(false);
//     } else {
//       navigate('/admin/items', { replace: true });
//     }
//   };

//   return (
//     <div className="edit-form-container">
//       <h2>Edit Movie #{id}</h2>
//       {error && <p className="error-text">{error}</p>}
//       <form onSubmit={handleSubmit} className="edit-form">
//         {/* Title */}
//         <div className="form-row">
//           <label>Title</label>
//           <input
//             name="Title"
//             value={form.Title}
//             onChange={onChange}
//             required
//           />
//         </div>

//         {/* Current Price */}
//         <div className="form-row">
//           <label>Current Price ($)</label>
//           <input
//             type="number"
//             step="0.01"
//             name="CurrentPrice"
//             value={form.CurrentPrice}
//             onChange={onChange}
//             required
//           />
//         </div>

//         {/* Release Year */}
//         <div className="form-row">
//           <label>Release Year</label>
//           <input
//             name="Year"
//             value={form.Year}
//             onChange={onChange}
//           />
//         </div>

//         {/* Quantity */}
//         <div className="form-row">
//           <label>Quantity</label>
//           <input
//             type="number"
//             name="Quantity"
//             value={form.Quantity}
//             onChange={onChange}
//           />
//         </div>

//         {/* Disc */}
//         <div className="form-row">
//           <label>Disc</label>
//           <input
//             name="Disc"
//             value={form.Disc}
//             onChange={onChange}
//           />
//         </div>

//         {/* Type */}
//         <div className="form-row">
//           <label>Type</label>
//           <input
//             name="Type"
//             value={form.Type}
//             onChange={onChange}
//           />
//         </div>

//         {/* Genres */}
//         <div className="form-row">
//           <label>Genres</label>
//           <input
//             name="Genres"
//             value={form.Genres}
//             onChange={onChange}
//           />
//         </div>

//         {/* Director */}
//         <div className="form-row">
//           <label>Director</label>
//           <input
//             name="Director"
//             value={form.Director}
//             onChange={onChange}
//           />
//         </div>

//         {/* Cast */}
//         <div className="form-row">
//           <label>Cast</label>
//           <input
//             name="Cast"
//             value={form.Cast}
//             onChange={onChange}
//           />
//         </div>

//         {/* Description */}
//         <div className="form-row">
//           <label>Description</label>
//           <textarea
//             name="Description"
//             rows="3"
//             value={form.Description}
//             onChange={onChange}
//           />
//         </div>

//         {/* Poster Upload */}
//         <div className="form-row">
//           <label>Poster Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={onFileChange}
//           />
//           {uploading && <small>Uploading…</small>}
//           {form.PosterURL && (
//             <img
//               src={form.PosterURL}
//               alt="Preview"
//               className="poster-preview"
//             />
//           )}
//         </div>

//         {/* Actions */}
//         <div className="form-actions">
//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? 'Saving…' : 'Save Changes'}
//           </button>
//           <button
//             type="button"
//             className="btn btn-secondary"
//             onClick={() => navigate('/admin/items')}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
// );
// }
