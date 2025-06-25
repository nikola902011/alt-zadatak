import React, { useState, useEffect } from 'react';
import './EditProfilePage.css';
import { API_BASE_URL, fetchCurrentUserProfile, updateCurrentUserProfile, logout, uploadUserImage } from '../services/api';
import type { UserDto } from '../services/api';

interface EditProfilePageProps {
  user: any;
  isImageUpdate: boolean;
  setIsImageUpdate: (val: boolean) => void;
  onUserUpdate: (updatedUser: any) => void;
}

const defaultProfileImg = '/images/icons/profile.svg';

const EditProfilePage = ({ user, isImageUpdate, setIsImageUpdate, onUserUpdate }: EditProfilePageProps) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    contact: '',
    password: ''
  });
  const [profileImg, setProfileImg] = useState(defaultProfileImg);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log('EditProfilePage user prop:', user);
    
    const fetchUserData = async () => {
      setLoading(true);
      try {
        console.log('Fetching user data from API...');
        const userData = await fetchCurrentUserProfile();
        console.log('User data from API:', userData);
        
        if (userData) {
          console.log('Setting form with API data:', userData);
          setForm({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            username: userData.username || '',
            contact: userData.contactNumber || '',
            password: ''
          });
          setProfileImg(userData.profileImagePath ? `${API_BASE_URL}${userData.profileImagePath}` : defaultProfileImg);
        } else {
          console.log('No API data, using user prop as fallback');
          if (user) {
            setForm({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              username: user.username || '',
              contact: user.contactNumber || '',
              password: ''
            });
            setProfileImg(user.profileImagePath ? `${API_BASE_URL}${user.profileImagePath}` : defaultProfileImg);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (user) {
          setForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            username: user.username || '',
            contact: user.contactNumber || '',
            password: ''
          });
          setProfileImg(user.profileImagePath ? `${API_BASE_URL}${user.profileImagePath}` : defaultProfileImg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const dto: UserDto = {
      id: 0, 
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      username: form.username,
      profileImagePath: undefined,
      contactNumber: form.contact
    };
    const result = await updateCurrentUserProfile(dto);
    if (result) {
      setMessage('Profile updated successfully!');
    } else {
      setMessage('Failed to update profile.');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const imagePath = await uploadUserImage(selectedFile);
      const userProfile = await fetchCurrentUserProfile();
      if (userProfile) {
        await updateCurrentUserProfile({ ...userProfile, profileImagePath: imagePath });
        const updatedUserProfile = await fetchCurrentUserProfile();
        if (updatedUserProfile) {
          const updatedUserWithRole = {
            ...updatedUserProfile,
            role: user.role, 
            token: user.token 
          };
          onUserUpdate(updatedUserWithRole);
        }
        setIsImageUpdate(false);
      }
    } catch (err) {
      setMessage('Failed to upload image.');
    }
    setUploading(false);
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 } 
        } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please make sure you have granted camera permissions.');
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(blob));
            closeCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  if (loading) return <div style={{textAlign:'center',marginTop:40}}>Loading...</div>;

  return (
    <div className="editProfileMain">
        <div className="editSettingsBar">
          <div className="editSettingsBarH1">Personal information settings</div>
          <div className='logoutText' onClick={handleLogout} style={{cursor:'pointer'}}>Logout</div>
        </div>
        {!isImageUpdate && (
        <div className='borderBox'>
            <div className="editProfileTitleHolder">
            <div className="editProfileTitleGradient">Edit Profile</div>
            <div className="editProfileImgHolder">
            <div 
                className="profileImageContainer"
                onClick={() => setIsImageUpdate(true)}
                >
                <img 
                    src={profileImg} 
                    alt="Profile" 
                    className="profileImage"
                />
                <div className="editIconContainer">
                    <img 
                    src="/images/icons/pen-to-square.svg" 
                    alt="Edit" 
                    className="editIcon"
                    />
                </div>
                </div>
            </div>
            </div>
            <form className="editProfileFormBox" autoComplete="off" onSubmit={handleSubmit}>
            <div className="editProfileRow">
                <div className="editProfileField">
                <label>First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="..." />
                </div>
                <div className="editProfileField">
                <label>Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="..." />
                </div>
            </div>
            <div className="editProfileField">
                <label>Email</label>
                <input name="email" value={form.email} disabled />
            </div>
            <div className="editProfileField">
                <label>Username</label>
                <input name="username" value={form.username} disabled placeholder="..." />
            </div>
            <div className="editProfileField">
                <label>Contact Number</label>
                <input name="contact" value={form.contact} onChange={handleChange} placeholder="..." />
            </div>
            <div className="editProfileField">
                <label>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="..." />
            </div>
            <div className="editProfileBtnRow">
                <button type="button" className="editProfileCancelBtn" onClick={handleCancel} disabled={saving}>Cancel</button>
                <button type="submit" className="editProfileSaveBtn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
            {message && <div style={{textAlign:'center',marginTop:16, color: message.includes('success') ? 'green' : 'red'}}>{message}</div>}
            </form>
        </div>
        )}
        {isImageUpdate && (
            <div className="editProfileImageUpdateContainer">
                <div className="cameraOptionHolder" onClick={openCamera} style={{cursor:'pointer'}}>
                    <div className="cameraOptionImage"></div>
                    <div className="cameraOptionText">Take photo with camera</div>
                </div>
                <div className="cameraOptionHolder" onClick={() => document.getElementById('fileInput')?.click()} style={{cursor:'pointer'}}>
                    <div className="cameraOptionImage" style={previewUrl ? { backgroundImage: `url(${previewUrl})`, borderRadius: '50%' } : {}}></div>
                    <div className="cameraOptionText">Upload Photo from your phone</div>
                    <input id="fileInput" type="file" accept="image/*" style={{display:'none'}} onChange={handleFileChange} />
                </div>
                <div className="productActions profileImageUpdateBtnRow">
                    <button className="actionButton editButton" onClick={handleUpload} disabled={!selectedFile || uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
                    <button className="actionButton deleteButton" onClick={() => setIsImageUpdate(false)}>Skip</button>
                </div>
            </div>
        )}

        {/* Camera Modal */}
        {showCamera && (
            <div className="cameraModal">
                <div className="cameraModalContent">
                    <h3>Take Photo</h3>
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline
                        style={{ width: '100%', maxWidth: '500px', borderRadius: '8px' }}
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <div className="cameraButtons">
                        <button onClick={takePhoto} className="actionButton editButton">Take Photo</button>
                        <button onClick={closeCamera} className="actionButton deleteButton">Cancel</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default EditProfilePage; 