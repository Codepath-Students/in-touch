import React from 'react';
import SidebarProfile from './Sidebar-Profile.jsx';

const profile = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    bio: 'Frontend developer. Coffee enthusiast. Avid reader.',
    avatar: 'https://i.pravatar.cc/150?img=3'
};

const ProfilePage = () => (
    <div style={{ display: 'flex', maxWidth: 900 }}>
        <SidebarProfile />
        <div className="profile-section" style={{ flex: 1, marginLeft: 32 }}>
            <h1>Profile section</h1>
           
        </div>
    </div>
);

export default ProfilePage;