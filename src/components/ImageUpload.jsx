// import { useState, useEffect } from "react";
// import { storage, db } from "../firebase/firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { collection, addDoc, getDocs } from "firebase/firestore";

// const ImageUpload = () => {
//   const [image, setImage] = useState(null);
//   const [images, setImages] = useState([]);

//   // upload image
//   const handleUpload = async () => {
//     if (!image) return alert("Select image first");

//     // 1️⃣ Create storage reference
//     const imageRef = ref(storage, `images/${Date.now()}-${image.name}`);

//     // 2️⃣ Upload image to storage
//     await uploadBytes(imageRef, image);

//     // 3️⃣ Get download URL
//     const url = await getDownloadURL(imageRef);

//     // 4️⃣ Save URL in Firestore
//     await addDoc(collection(db, "images"), {
//       imageUrl: url,
//       createdAt: new Date(),
//     });

//     setImage(null);
//     fetchImages();
//   };

//   // get images from firestore
//   const fetchImages = async () => {
//     const snapshot = await getDocs(collection(db, "images"));
//     const data = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     setImages(data);
//   };

//   useEffect(() => {
//     fetchImages();
//   }, []);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Image Upload</h2>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setImage(e.target.files[0])}
//       />

//       <button onClick={handleUpload}>Upload</button>

//       <hr />

//       <h3>Uploaded Images</h3>
//       <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//         {images.map((img) => (
//           <img
//             key={img.id}
//             src={img.imageUrl}
//             alt=""
//             width="150"
//             style={{ borderRadius: 8 }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageUpload;
