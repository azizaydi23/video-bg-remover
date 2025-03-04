import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";

const createSegmenter = async () => {
  const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
  const segmenterConfig: bodySegmentation.MediaPipeSelfieSegmentationMediaPipeModelConfig = {
    runtime: "mediapipe" as const,
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
    modelType: "general",
  };
  return bodySegmentation.createSegmenter(model, segmenterConfig);
};

class VideoBackground {
  #animationId: any;
  #segmenter: any;
  #mediaRecorder: MediaRecorder | null = null;
  #recordedChunks: Blob[] = [];

  getSegmenter = async () => {
    if (!this.#segmenter) {
      this.#segmenter = await createSegmenter();
    }
    return this.#segmenter;
  };

  stop = () => {
    cancelAnimationFrame(this.#animationId);
    console.log("Stopped background removal");
    if (this.#mediaRecorder && this.#mediaRecorder.state !== "inactive") {
      this.#mediaRecorder.stop();
    }
  };

  remove = async (canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
    if (video.readyState < 2) {
      console.error("Video not ready!");
      return;
    }

    // Set canvas size to match video dimensions.
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Canvas context not found!");
      return;
    }

    const segmenter = await this.getSegmenter();
    console.log("Removing background -> Video Size:", video.videoWidth, video.videoHeight);

    // Set up MediaRecorder on the canvas stream.
    const stream = canvas.captureStream(30); // Capture at 30 FPS.
    this.#mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    this.#recordedChunks = [];
    this.#mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.#recordedChunks.push(event.data);
      }
    };
    this.#mediaRecorder.onstop = () => {
      const blob = new Blob(this.#recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const previewVideo = document.getElementById("previewVideo") as HTMLVideoElement;
      const downloadBtn = document.getElementById("downloadBtn") as HTMLAnchorElement;
      previewVideo.src = url;
      previewVideo.load();
      previewVideo.style.display = "block";
      downloadBtn.href = url;
      downloadBtn.style.display = "inline-block";
    };
    this.#mediaRecorder.start();

    const processFrame = async () => {
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const segmentation = await segmenter.segmentPeople(video);
      if (!segmentation || segmentation.length === 0) {
        console.warn("No segmentation data received.");
        this.#animationId = requestAnimationFrame(processFrame);
        return;
      }

      const coloredPartImage = await bodySegmentation.toBinaryMask(segmentation);
      await bodySegmentation.drawMask(
        canvas,
        video,
        coloredPartImage,
        1.0,   // Mask opacity.
        0,     // No blur.
        false  // No horizontal flip.
      );

      // Stop recording when the video is paused or ended.
      if (video.paused || video.ended) {
        this.stop();
        return;
      }

      this.#animationId = requestAnimationFrame(processFrame);
    };

    this.#animationId = requestAnimationFrame(processFrame);
  };
}

const videoBackground = new VideoBackground();

document.addEventListener("DOMContentLoaded", () => {
  const videoInput = document.getElementById("videoInput") as HTMLInputElement;
  const videoElement = document.getElementById("videoElement") as HTMLVideoElement;
  const canvasElement = document.getElementById("canvasElement") as HTMLCanvasElement;
  const removeBgButton = document.getElementById("removeBgButton") as HTMLButtonElement;

  videoInput.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const fileURL = URL.createObjectURL(target.files[0]);
      videoElement.src = fileURL;
      videoElement.play();
    }
  });

  removeBgButton.addEventListener("click", () => {
    canvasElement.hidden = false; // Show canvas when processing starts.
    videoBackground.remove(canvasElement, videoElement);
  });
});
