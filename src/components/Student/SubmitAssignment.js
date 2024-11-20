import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signOut, storage, realTimeDb } from '../../firebaseConfig'; // Import Firebase config
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, push } from 'firebase/database'; // Realtime Database references

// Header Component
const Header = ({ handleLogout }) => (
  <header className="bg-card text-card-foreground shadow-md p-4 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <h1 className="text-xl font-bold">Student</h1>
    </div>
    <div className="flex items-center space-x-4">
      <button
        className="bg-destructive text-destructive-foreground hover:bg-destructive/80 p-2 rounded-lg"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  </header>
);

// Sidebar Component
const Sidebar = () => (
  <aside
    className="bg-card text-card-foreground w-64 p-4 hidden md:block"
    style={{ backgroundColor: '#FFFAFA' }}
  >
    <nav className="space-y-2">
      <a
        href="/dashboardstudent"
        className="bg-blue-400 block p-2 rounded-lg hover:bg-secondary/80"
      >
        Student
      </a>
    </nav>
  </aside>
);

// SubmitAssignment Component
const SubmitAssignment = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null);

  // Reusable file upload function
  const uploadFileToFirebase = async (file, path) => {
    try {
      const fileRef = ref(storage, path);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload files
      const uploadedFiles = [];
      for (const file of files) {
        const fileUrl = await uploadFileToFirebase(file, `assignments/files/${file.name}`);
        uploadedFiles.push(fileUrl);
      }

      // Upload image
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadFileToFirebase(image, `assignments/images/${image.name}`);
      }

      // Save assignment to Realtime Database
      const assignmentRef = dbRef(realTimeDb, 'assignments-student');
      await push(assignmentRef, {
        title,
        description,
        files: uploadedFiles,
        image: imageUrl,
        timestamp: new Date().toISOString(),
      });

      alert('Assignment submitted successfully!');
      setTitle('');
      setDescription('');
      setFiles([]);
      setImage(null);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Header handleLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <div className="max-w-lg mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Submit Your Assignment</h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="Enter assignment title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border border-border rounded-md"
                  rows="4"
                  placeholder="Enter a brief description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium mb-1">Upload Files</label>
                <input
                  type="file"
                  id="file-upload"
                  className="w-full px-3 py-2 border border-border rounded-md"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                />
              </div>
              <div>
                <label htmlFor="image-upload" className="block text-sm font-medium mb-1">Upload Image</label>
                <input
                  type="file"
                  id="image-upload"
                  className="w-full px-3 py-2 border border-border rounded-md"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/80 focus:outline-none"
              >
                Submit Assignment
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubmitAssignment;
