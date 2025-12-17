# Slot Machine with Friends' Faces

A 3D slot machine featuring your friends' faces on a rotating 10-sided shape.

## Getting Started

**Important:** Due to browser security (CORS), you need to run a local web server instead of opening the HTML file directly.

### Option 1: Python Server (Recommended)

1. Run the server:
   ```bash
   python3 server.py
   ```
   Or make it executable and run:
   ```bash
   chmod +x start-server.sh
   ./start-server.sh
   ```

2. Open `http://localhost:8000/index.html` in your browser

### Option 2: Node.js http-server

If you have Node.js installed:
```bash
npx http-server -p 8000
```

Then open `http://localhost:8000/index.html` in your browser

## Features

- 10-sided 3D cylinder that rotates continuously
- Ready for adding images/textures to each face
- Responsive design that adapts to window size

## Next Steps

- Add image textures to each of the 10 faces
- Implement slot machine mechanics (spinning, stopping, matching)
- Add controls for user interaction
