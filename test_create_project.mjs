const testCreate = async () => {
    const payload = {
        title: 'Debug Test Project',
        description: 'Test description',
        category: 'Residential',
        year: '2026',
        location: '',
        featured: false,
        published: false,
        coverImage: '',
        modelUrl: '',
        images: []
    };

    try {
        const res = await fetch('http://localhost:3000/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);
    } catch (err) {
        console.error('Fetch error:', err);
    }
};

testCreate();
