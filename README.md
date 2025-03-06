

# Video BG Remover

A web application that leverages TensorFlow.js and MediaPipe Selfie Segmentation to remove or replace video backgrounds in real time. With Video BG Remover, users can upload a video, have the background removed automatically, preview the processed video, and download the final output as a WebM file.

[![Demo](https://img.shields.io/badge/Demo-View-blue)](https://your-demo-url.com)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Usage](#usage)
  - [Running the App](#running-the-app)
  - [Demo Interface](#demo-interface)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Overview

Video BG Remover is a real-time web application built with TypeScript, TensorFlow.js, and MediaPipe that processes videos to remove the background. The app records the processed video directly from the canvas, shows a live preview, and lets you download the final video. It’s perfect for virtual meetings, creative projects, or simply experimenting with background removal technology.

---

## Features

- **Real-Time Processing:** Remove or replace video backgrounds on the fly.
- **Record & Download:** Capture the processed video from the canvas and download it as a WebM file.
- **Intuitive UI:** A modern, responsive interface built with Tailwind CSS.
- **TypeScript-Powered:** Written in TypeScript with robust type definitions and modern development practices.

---

## Usage

### Running the App

To run the app locally:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/video-bg-remover.git
   cd video-bg-remover
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Start the Development Server:**

   ```bash
   npm run dev
   ```

   Open your browser and navigate to `http://localhost:3000` (or your configured port) to view the app in action.

### Demo Interface

The app’s interface includes:
- **Video Upload:** Choose a video file to upload.
- **Video Preview:** Watch your selected video in a standard video player.
- **Canvas Display:** See the processed video with the background removed.
- **Control Button:** Click the “Remove Background” button to start processing.
- **Processed Video Preview & Download:** After processing, view a preview of the final video and download it as a WebM file.

---

## How It Works

1. **Upload:**  
   Users upload a video file, which is then loaded and played in a video element.

2. **Processing:**  
   The app uses MediaPipe Selfie Segmentation (via TensorFlow.js) to generate a segmentation mask for each video frame. The mask is used to remove the background by drawing the processed frame onto a canvas.

3. **Recording:**  
   The canvas’s stream is recorded in real time using the MediaRecorder API. When the video ends or is paused, recording stops.

4. **Preview & Download:**  
   The recorded video is then previewed on the app, and a download button allows users to save the processed video locally.

---


## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes.
4. Push your branch and open a Pull Request with a detailed description of your changes.

For major changes, please open an issue first to discuss what you would like to modify.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- [TensorFlow.js](https://www.tensorflow.org/js)
- [MediaPipe Selfie Segmentation](https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation)
- Thanks to the open-source community for inspiration, support, and feedback.

