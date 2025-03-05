import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaEdit, FaSun, FaMoon, FaArrowLeft, FaCamera, FaSpinner, FaTimes } from 'react-icons/fa';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import '../../styles/MyProfile.css';
import '../../styles/PageTransitions.css';
import { useNavigate } from 'react-router-dom';

const MyProfile = ({ isDarkMode, setIsDarkMode }) => {
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+90 555 123 4567',
    birthDate: '1990-01-01',
    membershipStart: '2024-01-01',
    membershipEnd: '2025-01-01',
    profileImage: 'https://via.placeholder.com/150'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    aspect: 1
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check dark mode status when page loads
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [setIsDarkMode]);

  const handleEditMember = () => {
    setIsEditing(true);
  };

  const handleSaveMember = () => {
    // TODO: API call to update profile
    setProfile(prev => ({
      ...prev,
      fullName: prev.fullName,
      email: prev.email,
      phone: prev.phone,
      birthDate: prev.birthDate,
      membershipStart: prev.membershipStart,
      membershipEnd: prev.membershipEnd
    }));
    setIsEditing(false);
  };

  const handleCancelMember = () => {
    setIsEditing(false);
  };

  const handleChangeMember = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleDarkModeMember = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const onImageLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setShowImageModal(true);
        setCrop({
          unit: '%',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          aspect: 1
        });
        setCompletedCrop(null);
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCrop = useCallback(() => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Profil fotoğrafı için sabit boyutlar
    const targetSize = 300;
    canvas.width = targetSize;
    canvas.height = targetSize;

    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      targetSize,
      targetSize
    );

    const base64Image = canvas.toDataURL('image/jpeg', 0.9);
    setCroppedImage(base64Image);
  }, [completedCrop]);

  useEffect(() => {
    generateCrop();
  }, [completedCrop, generateCrop]);

  const handleUpload = () => {
    if (!croppedImage) {
      alert('Lütfen önce fotoğrafı kırpın.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simüle edilmiş yükleme işlemi
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowImageModal(false);
          setProfile(prev => ({
            ...prev,
            profileImage: croppedImage
          }));
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCancel = () => {
    setShowImageModal(false);
    setTempImage(null);
    setCroppedImage(null);
    setUploadProgress(0);
  };

  return (
    <div className={`my-profile-container-myprofile container-animate ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="profile-content-myprofile">
        <div className="profile-header-myprofile">
          <button className="back-button-myprofile" onClick={() => navigate('/member')}>
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>

          <button 
            className={`dark-mode-toggle-myprofile ${isDarkMode ? 'active' : ''}`} 
            onClick={toggleDarkModeMember}
          >
            <FaSun className="toggle-icon-myprofile sun-myprofile" />
            <div className="toggle-circle-myprofile"></div>
            <FaMoon className="toggle-icon-myprofile moon-myprofile" />
          </button>
        </div>

        <div className="profile-top-myprofile">
          <div className="profile-photo-container-myprofile" onClick={handleImageClick}>
            <img src={profile.profileImage} alt="Profile" className="profile-photo-myprofile" />
            <div className={`profile-photo-overlay-myprofile ${isUploading ? 'uploading' : ''}`}>
              {isUploading ? (
                <>
                  <FaSpinner className="spinner-icon-myprofile" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FaCamera className="camera-icon-myprofile" />
                  <span>Change Photo</span>
                </>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <h2 className="profile-name-myprofile">{profile.fullName}</h2>
          {!isEditing && (
            <button className="edit-button-myprofile" onClick={handleEditMember}>
              <FaEdit />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="profile-fields-myprofile">
          <div className="profile-field-myprofile card-animate stagger-1">
            <div className="field-icon-myprofile">
              <FaUser />
            </div>
            <div className="field-content-myprofile">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChangeMember}
                />
              ) : (
                <p>{profile.fullName}</p>
              )}
            </div>
          </div>

          <div className="profile-field-myprofile card-animate stagger-2">
            <div className="field-icon-myprofile">
              <FaEnvelope />
            </div>
            <div className="field-content-myprofile">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChangeMember}
                />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>
          </div>

          <div className="profile-field-myprofile card-animate stagger-3">
            <div className="field-icon-myprofile">
              <FaPhone />
            </div>
            <div className="field-content-myprofile">
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChangeMember}
                />
              ) : (
                <p>{profile.phone}</p>
              )}
            </div>
          </div>

          <div className="profile-field-myprofile card-animate stagger-4">
            <div className="field-icon-myprofile">
              <FaCalendar />
            </div>
            <div className="field-content-myprofile">
              <label>Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="birthDate"
                  value={profile.birthDate}
                  onChange={handleChangeMember}
                />
              ) : (
                <p>{new Date(profile.birthDate).toLocaleDateString('en-US')}</p>
              )}
            </div>
          </div>

          <div className="membership-info-myprofile card-animate stagger-5">
            <h3>Membership Information</h3>
            <div className="membership-dates-myprofile">
              <div>
                <label>Start Date</label>
                <p>{new Date(profile.membershipStart).toLocaleDateString('en-US')}</p>
              </div>
              <div>
                <label>End Date</label>
                <p>{new Date(profile.membershipEnd).toLocaleDateString('en-US')}</p>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="profile-actions-myprofile card-animate stagger-5">
              <button className="cancel-button-myprofile" onClick={handleCancelMember}>
                Cancel
              </button>
              <button className="save-button-myprofile" onClick={handleSaveMember}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {showImageModal && (
        <div className="image-modal-overlay-myprofile">
          <div className="image-modal-myprofile">
            <div className="modal-header-myprofile">
              <h3>Profil Fotoğrafını Kırp</h3>
              <button className="close-button-myprofile" onClick={handleCancel}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-content-myprofile">
              <div className="crop-container-myprofile">
                <ReactCrop
                  crop={crop}
                  onChange={c => setCrop(c)}
                  onComplete={c => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                  className="react-crop"
                >
                  <img
                    src={tempImage}
                    alt="Kırpılacak fotoğraf"
                    onLoad={onImageLoad}
                    style={{ maxHeight: '400px', width: 'auto' }}
                  />
                </ReactCrop>
              </div>
              <div className="preview-container-myprofile">
                <h4>Önizleme</h4>
                {croppedImage && (
                  <img
                    src={croppedImage}
                    alt="Önizleme"
                    className="preview-image-myprofile"
                  />
                )}
              </div>
              <div className="progress-bar-container-myprofile">
                <div 
                  className="progress-bar-myprofile"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="progress-text-myprofile">{uploadProgress}%</p>
            </div>
            <div className="modal-footer-myprofile">
              <button className="cancel-button-myprofile" onClick={handleCancel}>
                İptal
              </button>
              <button 
                className="save-button-myprofile" 
                onClick={handleUpload}
                disabled={isUploading}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile; 
