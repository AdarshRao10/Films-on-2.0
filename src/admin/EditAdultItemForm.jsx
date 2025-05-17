// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import supabase from '../supabaseClient';
// import './EditItemForm.css';

// export default function EditAdultItemForm() {
//   const { AdultSerialNo } = useParams();
//   const id = parseInt(AdultSerialNo, 10);
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     Title: '', CurrentPrice: '', Year: '',
//     Quantity: '', Description: '', PosterURL: '',
//     Disc: '', Type: '', Genres: '', Director: '', Cast: ''
//   });
//   const [loading, setLoading]     = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError]         = useState('');

//   useEffect(() => {
//     if (isNaN(id)) return;
//     supabase
//       .from('Adult_titles')
//       .select('*')
//       .eq('AdultSerialNo', id)
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
//     const { data, error } = await supabase
//       .storage
//       .from('posters')
//       .upload(fileName, file);
//     if (error) {
//       setError(error.message);
//     } else {
//       const { publicUrl } = supabase
//         .storage
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
//       .from('Adult_titles')
//       .update(updates)
//       .eq('AdultSerialNo', id);
//     if (updateError) setError(updateError.message);
//     else navigate('/admin/adult/items', { replace: true });
//     setLoading(false);
//   };

//   return (
//     <div className="edit-form-container">
//       <h2>Edit Adult Movie #{id}</h2>
//       {error && <p className="error-text">{error}</p>}
//       <form onSubmit={handleSubmit} className="edit-form">
//         {/* same form rows */}
//         {/* … */}
//         <div className="form-actions">
//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? 'Saving…' : 'Save Changes'}
//           </button>
//           <button type="button" className="btn btn-secondary"
//                   onClick={() => navigate('/admin/adult/items')} disabled={loading}>
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
