import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, CreditCard, Camera, Loader2, CheckCircle } from 'lucide-react';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProfilePage = () => {
    const [profileDetails, setProfileDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isSavingPhoto, setIsSavingPhoto] = useState(false);
    const [photoChanged, setPhotoChanged] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.token) {
                    throw new Error('You must be logged in to view your profile.');
                }
                const data = await authService.getProfile(user.token);
                setProfileDetails(data);
                if (data.profilePhoto) {
                    setPhotoPreview(data.profilePhoto);
                }
            } catch (err) {
                setError((err.response?.data?.message) || err.message || err.toString());
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            toast.error('Image too large! Please choose a photo under 1MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            setPhotoPreview(ev.target.result);
            setPhotoChanged(true);
        };
        reader.readAsDataURL(file);
    };

    const handleSavePhoto = async () => {
        if (!photoPreview || !photoChanged) return;
        setIsSavingPhoto(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await fetch(`${API_BASE_URL}/api/users/profile/photo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ photoData: photoPreview }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to save photo');
            toast.success('Profile photo updated!');
            setPhotoChanged(false);
            setProfileDetails(prev => ({ ...prev, profilePhoto: data.profilePhoto }));
        } catch (err) {
            toast.error(err.message || 'Could not save photo');
        } finally {
            setIsSavingPhoto(false);
        }
    };

    if (isLoading) return <Loader message="Loading profile..." />;
    if (error) return <div className="flex items-center justify-center text-red-500 font-medium h-full">Error: {error}</div>;

    const getInitials = (name) =>
        name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);

    return (
        <div className="w-full h-full">
            {/* Decorative Banner */}
            <div className="h-48 relative overflow-hidden rounded-2xl mb-0"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-10 -mb-10 blur-2xl" />
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-8 pb-12 -mt-20">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="md:flex">
                        {/* Left: Avatar Card */}
                        <div className="md:w-1/3 bg-gray-50 p-8 text-center border-r border-gray-100 flex flex-col items-center">
                            {/* Avatar */}
                            <div className="relative inline-block mb-5">
                                <div className="h-32 w-32 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white overflow-hidden"
                                    style={{ background: photoPreview ? 'transparent' : 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                                    {photoPreview
                                        ? <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
                                        : getInitials(profileDetails?.name || '')}
                                </div>
                                {/* Camera button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-indigo-600 hover:shadow-lg transition-all border border-gray-100"
                                    title="Change Photo"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                            </div>

                            {/* Save photo button */}
                            {photoChanged && (
                                <button
                                    onClick={handleSavePhoto}
                                    disabled={isSavingPhoto}
                                    className="mb-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-70"
                                    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                                >
                                    {isSavingPhoto
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                        : <><CheckCircle className="w-4 h-4" /> Save Photo</>
                                    }
                                </button>
                            )}

                            <h2 className="text-2xl font-bold text-gray-800 mb-1">{profileDetails?.name}</h2>
                            <p className="text-gray-500 font-medium mb-4">Student</p>
                            <p className="text-xs text-gray-400 mb-4">Click the camera icon to upload a new photo (max 1MB)</p>

                            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
                                Active Student
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="md:w-2/3 p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-gray-800">Profile Details</h3>
                            </div>

                            <div className="space-y-5">
                                <div className="group">
                                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Full Name</label>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 group-hover:border-indigo-200 transition-colors">
                                        <div className="p-2 bg-white rounded-lg text-indigo-400 shadow-sm">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="font-semibold text-gray-800 text-base">{profileDetails?.name}</div>
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Email Address</label>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 group-hover:border-indigo-200 transition-colors">
                                        <div className="p-2 bg-white rounded-lg text-indigo-400 shadow-sm">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div className="font-semibold text-gray-800 text-base">{profileDetails?.email}</div>
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Student PRN</label>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 group-hover:border-indigo-200 transition-colors">
                                        <div className="p-2 bg-white rounded-lg text-indigo-400 shadow-sm">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div className="font-semibold text-gray-800 text-base font-mono">{profileDetails?.prn || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;