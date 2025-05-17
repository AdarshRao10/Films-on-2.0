// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import supabase from '../supabaseClient';
// import './ItemList.css';

// export default function AdultItemList() {
//   const [items, setItems] = useState([]);
//   const [searchTerm, setSearch] = useState('');
//   const [currentPage, setPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     supabase
//       .from('Adult_titles')
//       .select('*')
//       .order('AdultSerialNo', { ascending: false })
//       .then(({ data, error }) => {
//         if (error) console.error(error);
//         else setItems(data);
//       });
//   }, []);

//   const handleDelete = async (AdultSerialNo) => {
//     await supabase
//       .from('Adult_titles')
//       .delete()
//       .eq('AdultSerialNo', AdultSerialNo);
//     setItems(items.filter(item => item.AdultSerialNo !== AdultSerialNo));
//   };

//   // filter + paginate
//   const filtered = items.filter(i =>
//     i.Title?.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

//   const goPage = n => {
//     if (n >= 1 && n <= totalPages) {
//       setPage(n);
//       window.scrollTo(0, 0);
//     }
//   };

//   return (
//     <div className="item-list-container">
//       <div className="list-header">
//         <h1>Adult Titles</h1>
//         {/* <Link to="/admin/adult/items/new" className="btn add-new">
//           + Add New Adult Item
//         </Link> */}
//         <input
//           type="text"
//           placeholder="Search by title…"
//           value={searchTerm}
//           onChange={e => { setSearch(e.target.value); setPage(1); }}
//         />
//       </div>

//       <table className="item-table">
//         <thead>
//           <tr>
//             <th>Serial#</th>
//             <th>ProductID</th>
//             <th>Condition</th>
//             <th>Title</th>
//             <th>Production</th>
//             <th>Release Date</th>
//             <th>Price</th>
//             <th>Quantity</th>
//             <th>Poster</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentItems.map(item => (
//             <tr key={item.AdultSerialNo}>
//               <td>{item.AdultSerialNo}</td>
//               <td>{item.ProductID}</td>
//               <td>{item.Condition}</td>
//               <td>{item.Title}</td>
//               <td>{item.Production}</td>
//               <td>{item['Release Date']}</td>
//               <td>${item.CurrentPrice?.toFixed(2)}</td>
//               <td>{item.Quantity}</td>
//               <td>
//                 {item.PosterURL ? (
//                   <img src={item.PosterURL} alt={item.Title} className="poster-thumb" />
//                 ) : (
//                   <span className="no-image">—</span>
//                 )}
//               </td>
//               <td>
//                 <Link to={`/admin/adult/items/${item.AdultSerialNo}/edit`} className="btn-sm">
//                   Edit
//                 </Link>
//               <button
//                 className="btn-sm danger"
//                 onClick={async () => {
//                   const confirmDelete = window.confirm(`Are you sure you want to delete "${item.Title}"?`);
//                   if (!confirmDelete) return;

//                   await supabase
//                    .from('Regular_titles')
//                    .delete()
//                    .eq('RegSerialNo', item.RegSerialNo);
//                   setItems(items.filter(i => i.RegSerialNo !== item.RegSerialNo));
//                 }}
//               >
//                 Delete
//               </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {totalPages > 1 && (
//         <div className="pagination-container">
//           <button onClick={() => goPage(1)} disabled={currentPage === 1}>First</button>
//           <button onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1)
//             .slice(
//               Math.max(0, currentPage - 3),
//               Math.min(totalPages, currentPage + 2)
//             )
//             .map((num) => (
//               <button
//                 key={num}
//                 onClick={() => goPage(num)}
//                 className={num === currentPage ? "active" : ""}
//               >
//                 {num}
//               </button>
//             ))}
//           <button onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
//           <button onClick={() => goPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
//         </div>
//       )}
//     </div>
//   );
// }





// src/admin/AdultItemList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import './ItemList.css';

export default function AdultItemList() {
  const [items, setItems]       = useState([]);
  const [filters, setFilters]   = useState({
    serial: '', productId: '', title: '', production: '', date: '', condition: ''
  });
  const [currentPage, setPage]  = useState(1);
  const itemsPerPage            = 10;

  useEffect(() => {
    supabase
      .from('Adult_titles')
      .select('*')
      .order('AdultSerialNo', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setItems(data);
      });
  }, []);

  // Apply filters
  const filtered = items.filter(item => {
    const { serial, productId, title, production, date, condition } = filters;
    if (serial && !String(item.AdultSerialNo).includes(serial)) return false;
    if (productId && !String(item.ProductID).includes(productId)) return false;
    if (title && !item.Title.toLowerCase().includes(title.toLowerCase())) return false;
    if (production && !item.Production.toLowerCase().includes(production.toLowerCase())) return false;
    if (date && !String(item['Release Date']).includes(date)) return false;
    if (condition && !item.Condition.toLowerCase().includes(condition.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const goPage = n => {
    if (n >= 1 && n <= totalPages) {
      setPage(n);
      window.scrollTo(0, 0);
    }
  };

  const onFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
    setPage(1);
  };

  return (
    <div className="item-list-container">
      <div className="list-header">
        <h1>Adult Titles</h1>
        <div className="filters">
          <input name="serial" placeholder="Serial#" value={filters.serial} onChange={onFilterChange} />
          <input name="productId" placeholder="Product ID" value={filters.productId} onChange={onFilterChange} />
          <input name="title" placeholder="Title" value={filters.title} onChange={onFilterChange} />
          <input name="production" placeholder="Production" value={filters.production} onChange={onFilterChange} />
          <input name="date" placeholder="Release Date" value={filters.date} onChange={onFilterChange} />
          {/* <input name="condition" placeholder="Condition" value={filters.condition} onChange={onFilterChange} /> */}
        </div>
      </div>

      <table className="item-table">
        <thead>
          <tr>
            <th>Serial#</th><th>ProductID</th><th>Title</th>
            <th>Production</th><th>Release Date</th><th>Price</th><th>Quantity</th><th>Poster</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(item => (
            <tr key={item.AdultSerialNo}>
              <td>{item.AdultSerialNo}</td>
              <td>{item.ProductID}</td>
              {/* <td>{item.Condition}</td> */}
              <td>{item.Title}</td>
              <td>{item.Production}</td>
              <td>{item['Release Date']}</td>
              <td>${item.Price?.toFixed(2)}</td>
              <td>{item.Quantity}</td>
              <td>
                {item.PosterURL ? (
                  <img src={item.PosterURL} alt={item.Title} className="poster-thumb" />
                ) : <span className="no-image">—</span>}
              </td>
              <td>
                <Link to={`/admin/adult/items/${item.AdultSerialNo}/edit`} className="btn-sm">Edit</Link>
                <button className="btn-sm danger" onClick={async () => {
                  if (!window.confirm(`Delete "${item.Title}"?`)) return;
                  await supabase.from('Adult_titles').delete().eq('AdultSerialNo', item.AdultSerialNo);
                  setItems(items.filter(i => i.AdultSerialNo !== item.AdultSerialNo));
                }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button onClick={() => goPage(1)} disabled={currentPage === 1}>First</button>
          <button onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
            .map(num => (
              <button key={num} onClick={() => goPage(num)} className={num === currentPage ? 'active' : ''}>{num}</button>
            ))}
          <button onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          <button onClick={() => goPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
        </div>
      )}
    </div>
  );
}
