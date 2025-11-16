import React from 'react';

const profile = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    bio: 'Frontend developer. Coffee enthusiast. Avid reader.',
    avatar: 'https://i.pravatar.cc/150?img=3'
};

const ProfilePage = () => (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8, textAlign: 'center' }}>
        <img
            src={profile.avatar}
            alt="Profile"
            style={{ width: 100, height: 100, borderRadius: '50%', marginBottom: 16 }}
        />
        <h2>{profile.name}</h2>
        <p style={{ color: '#555' }}>{profile.email}</p>
        <p>{profile.bio}</p>
    </div>
);

export default ProfilePage;