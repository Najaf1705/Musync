const data = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Moderator' }
];


exports.getNajafMockData = (req, res) => {
    res.json(data);
}

exports.getNajafMockDataId = (req, res) => {
    const id = req.params.id;
    const item = data.find(d => d.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
}

exports.postNajafMockData = (req, res) => {
    const newData = req.body;
    data.push(newData);
    res.status(201).json(newData);
}   