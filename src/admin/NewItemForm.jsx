// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import supabase from '../supabaseClient';
// import './NewItemForm.css';

// export default function NewItemForm() {
//   const navigate = useNavigate();
//   const [category, setCategory] = useState(null);
//   const [form, setForm] = useState({
//     ProductID: '',
//     // Regular-only fields:
//     QtyToList: '',
//     Title: '',
//     Year: '',
//     Disc: '',
//     Type: '',
//     CurrentPrice: '',
//     Description: '',
//     Genres: '',
//     Director: '',
//     Cast: '',
//     // Adult-only fields:
//     Condition: '',
//     Price: '',
//     Quantity: '',
//     Production: '',
//     ReleaseDate: '',
//     PosterURL: '',
//   });
//   const [loading, setLoading]     = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError]         = useState('');

//   const onChange = e => {
//     const { name, value } = e.target;
//     setForm(f => ({ ...f, [name]: value }));
//   };

//   const onFileChange = async e => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setUploading(true);
//     const fileName = `${Date.now()}_${file.name}`;
//     const { data, error } = await supabase.storage.from('posters').upload(fileName, file);
//     if (error) setError(error.message);
//     else {
//       const { publicUrl } = supabase.storage.from('posters').getPublicUrl(data.path);
//       setForm(f => ({ ...f, PosterURL: publicUrl }));
//     }
//     setUploading(false);
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);

//     // assemble payload & target
//     let table, redirect, payload;
//     if (category === 'regular') {
//       table = 'Regular_titles';
//       redirect = '/admin/items';
//       payload = {
//         ProductID: form.ProductID,
//         QtyToList: parseInt(form.QtyToList, 10),
//         Title: form.Title,
//         ['Release Year']: form.Year,
//         Disc: form.Disc,
//         Type: form.Type,
//         CurrentPrice: parseFloat(form.CurrentPrice),
//         Description: form.Description,
//         PosterURL: form.PosterURL,
//         Genres: form.Genres,
//         Director: form.Director,
//         Cast: form.Cast,
//       };
//     } else {
//       table = 'Adult_titles';
//       redirect = '/admin/adult/items';
//       payload = {
//         ProductID: parseInt(form.ProductID, 10),
//         Condition: form.Condition,
//         Price: parseFloat(form.Price),
//         Quantity: parseInt(form.Quantity, 10),
//         Title: form.Title,
//         Production: form.Production,
//         ['Release Date']: form.ReleaseDate,
//         PosterURL: form.PosterURL,
//       };
//     }

//     const { error: insertError } = await supabase.from(table).insert([payload]);
//     if (insertError) {
//       setError(insertError.message);
//       setLoading(false);
//     } else {
//       navigate(redirect, { replace: true });
//     }
//   };

//   if (!category) {
//     return (
//       <div className="category-select-container">
//         <h2>Select Category</h2>
//         <div className="category-buttons">
//           <button className="btn" onClick={() => setCategory('regular')}>
//             Regular Titles
//           </button>
//           <button className="btn" onClick={() => setCategory('adult')}>
//             Adult Titles
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="edit-form-container">
//       <h2>Add New {category === 'regular' ? 'Regular' : 'Adult'} Movie</h2>
//       {error && <p className="error-text">{error}</p>}
//       <form onSubmit={handleSubmit} className="edit-form">
//         {/* shared ProductID */}
//         <div className="form-row">
//           <label>Product ID</label>
//           <input name="ProductID" value={form.ProductID} onChange={onChange} required />
//         </div>

//         {category === 'regular' ? (
//           <>
//             {/* Regular-only fields */}
//             <div className="form-row">
//               <label>Qty To List</label>
//               <input type="number" name="QtyToList" value={form.QtyToList} onChange={onChange} />
//             </div>
//             <div className="form-row">
//               <label>Title</label>
//               <input name="Title" value={form.Title} onChange={onChange} required />
//             </div>
//             <div className="form-row">
//               <label>Release Year</label>
//               <input name="Year" value={form.Year} onChange={onChange} />
//             </div>
//             <div className="form-row">
//               <label>Disc</label>
//               <input name="Disc" value={form.Disc} onChange={onChange} />
//             </div>
//             <div className="form-row">
//               <label>Type</label>
//               <input name="Type" value={form.Type} onChange={onChange} />
//             </div>
//             <div className="form-row">
//               <label>Current Price ($)</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 name="CurrentPrice"
//                 value={form.CurrentPrice}
//                 onChange={onChange}
//               />
//             </div>
//             <div className="form-row">
//               <label>Description</label>
//               <textarea name="Description" rows="3" value={form.Description} onChange={onChange} />
//             </div>
//             <div className="form-row">
//               <label>Genres</label>
//               <input name="Genres" value={form.Genres} onChange={onChange} />
//             </div>
//             <div className="form-row">
//               <label>Director</label>
//               <input name="Director" value={form.Director} onChange={onChange} />
//             </div>
//             <div className="form-row">
//               <label>Cast</label>
//               <input name="Cast" value={form.Cast} onChange={onChange} />
//             </div>
//           </>
//         ) : (
//           <>
//             {/* Adult-only fields */}
//             <div className="form-row">
//               <label>Condition</label>
//               <input name="Condition" value={form.Condition} onChange={onChange} />
//             </div>
//             <div className="form-row">
//               <label>Price ($)</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 name="Price"
//                 value={form.Price}
//                 onChange={onChange}
//               />
//             </div>
//             <div className="form-row">
//               <label>Quantity</label>
//               <input type="number" name="Quantity" value={form.Quantity} onChange={onChange} />
//             </div>
//             <div className="form-row">
//               <label>Title</label>
//               <input name="Title" value={form.Title} onChange={onChange} required />
//             </div>
//             <div className="form-row">
//               <label>Production</label>
//               <input name="Production" value={form.Production} onChange={onChange} />
//             </div>
//             <div className="form-row">
//               <label>Release Date</label>
//               <input name="Release Date" value={form.ReleaseDate} onChange={onChange} />
//             </div>
//           </>
//         )}

//         {/* Poster Upload */}
//         <div className="form-row">
//           <label>Poster Image</label>
//           <input type="file" accept="image/*" onChange={onFileChange} />
//           {uploading && <small>Uploading…</small>}
//           {form.PosterURL && (
//             <img src={form.PosterURL} alt="Preview" className="poster-preview" />
//           )}
//         </div>

//         {/* Actions */}
//         <div className="form-actions">
//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? 'Adding…' : 'Add Movie'}
//           </button>
//           <button
//             type="button"
//             className="btn btn-secondary"
//             onClick={() => navigate(category === 'adult' ? '/admin/adult/items' : '/admin/items')}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import './NewItemForm.css';

export default function NewItemForm() {
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [form, setForm] = useState({
    ProductID: '',
    QtyToList: '',
    Title: '',
    Year: '',
    Disc: '',
    Type: '',
    CurrentPrice: '',
    Description: '',
    Genres: '',
    Director: '',
    Cast: '',
    Condition: '',
    Price: '',
    Quantity: '',
    Production: '',
    ReleaseDate: '',
    PosterURL: ''
  });
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');

  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('posters')
      .upload(fileName, file);
    if (error) setError(error.message);
    else {
      const { publicUrl } = supabase.storage
        .from('posters')
        .getPublicUrl(data.path);
      setForm(f => ({ ...f, PosterURL: publicUrl }));
    }
    setUploading(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    let table, redirect, payload;

    if (category === 'regular') {
      table = 'Regular_titles';
      redirect = '/admin/items';

      // fetch current max RegSerialNo
      const { data: maxRow, error: maxErr } = await supabase
        .from(table)
        .select('RegSerialNo')
        .order('RegSerialNo', { ascending: false })
        .limit(1);
      if (maxErr) {
        setError(maxErr.message);
        setLoading(false);
        return;
      }
      const newRegSerial = (maxRow?.[0]?.RegSerialNo || 0) + 1;

      payload = {
        RegSerialNo: newRegSerial,
        ProductID: form.ProductID,
        QtyToList: parseInt(form.QtyToList, 10),
        Title: form.Title,
        ['Release Year']: form.Year,
        Disc: form.Disc,
        Type: form.Type,
        CurrentPrice: parseFloat(form.CurrentPrice),
        Description: form.Description,
        PosterURL: form.PosterURL,
        Genres: form.Genres,
        Director: form.Director,
        Cast: form.Cast
      };
    } else {
      table = 'Adult_titles';
      redirect = '/admin/adult/items';

      // fetch current max AdultSerialNo
      const { data: maxRowA, error: maxErrA } = await supabase
        .from(table)
        .select('AdultSerialNo')
        .order('AdultSerialNo', { ascending: false })
        .limit(1);
      if (maxErrA) {
        setError(maxErrA.message);
        setLoading(false);
        return;
      }
      const newAdultSerial = (maxRowA?.[0]?.AdultSerialNo || 0) + 1;

      payload = {
        AdultSerialNo: newAdultSerial,
        ProductID: parseInt(form.ProductID, 10),
        Condition: form.Condition,
        Price: parseFloat(form.Price),
        Quantity: parseInt(form.Quantity, 10),
        Title: form.Title,
        Production: form.Production,
        ['Release Date']: form.ReleaseDate,
        PosterURL: form.PosterURL
      };
    }

    const { error: insertError } = await supabase
      .from(table)
      .insert([payload]);
    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      navigate(redirect, { replace: true });
    }
  };

  if (!category) {
    return (
      <div className="category-select-container">
        <h2>Select Category</h2>
        <div className="category-buttons">
          <button className="btn" onClick={() => setCategory('regular')}>
            Regular Titles
          </button>
          <button className="btn" onClick={() => setCategory('adult')}>
            Adult Titles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-form-container">
      <h2>Add New {category === 'regular' ? 'Regular' : 'Adult'} Movie</h2>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit} className="edit-form">

        {/* ProductID */}
        <div className="form-row">
          <label>Product ID</label>
          <input
            name="ProductID"
            value={form.ProductID}
            onChange={onChange}
            required
          />
        </div>

        {category === 'regular' ? (
          <>
            {/* Regular-only fields */}
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
              <label>Title</label>
              <input
                name="Title"
                value={form.Title}
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
              <label>Current Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="CurrentPrice"
                value={form.CurrentPrice}
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
          </>
        ) : (
          <>
            {/* Adult-only fields */}
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
              <label>Title</label>
              <input
                name="Title"
                value={form.Title}
                onChange={onChange}
                required
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
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding…' : 'Add Movie'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(category === 'adult' ? '/admin/adult/items' : '/admin/items')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

