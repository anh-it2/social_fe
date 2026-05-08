"use client";

import { Avatar, Button, Flex, Input, Modal, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";
import { CURRENT_USER } from "../../data/constants";
import type { FeedPostData } from "../../data/types";

const { Text, Title } = Typography;

interface LiveBroadcastModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (post: FeedPostData) => void;
}

type Phase = "idle" | "preview" | "live";

export function LiveBroadcastModal({ open, onClose, onSubmit }: LiveBroadcastModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [viewers, setViewers] = useState(0);
  const [snapshot, setSnapshot] = useState<string | null>(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    return () => {
      stopStream();
      stopTimer();
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Camera not supported in this browser");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setPhase("preview");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Camera access denied";
      setError(msg);
    }
  };

  const goLive = () => {
    setPhase("live");
    setElapsed(0);
    setViewers(1);
    timerRef.current = setInterval(() => {
      setElapsed((s) => s + 1);
      setViewers((v) => v + Math.floor(Math.random() * 3));
    }, 1000);
  };

  const captureFrame = (): string | null => {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    try {
      return canvas.toDataURL("image/jpeg", 0.8);
    } catch {
      return null;
    }
  };

  const endLive = () => {
    const frame = captureFrame();
    setSnapshot(frame);
    stopTimer();
    stopStream();
    onSubmit({
      id: `fp-live-${Date.now()}`,
      author: {
        name: CURRENT_USER.name,
        initial: CURRENT_USER.initial,
        gradient: CURRENT_USER.gradient,
      },
      time: "Just now",
      text: title.trim() || "Was live",
      imageUrl: frame ?? undefined,
      isLive: true,
      likes: String(viewers),
      comments: 0,
      shares: 0,
    });
    onClose();
  };

  const cancel = () => {
    stopTimer();
    stopStream();
    onClose();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  };

  return (
    <Modal
      open={open}
      onCancel={cancel}
      footer={null}
      width={720}
      destroyOnHidden
      className="live-broadcast-modal"
      closeIcon={<Icon name="close" size={20} color="#e4e6eb" />}
      title={null}
      styles={{
        body: { background: "#0a0a0a", padding: 0 },
        header: { display: "none" },
      }}
    >
      <style>{`
        .live-broadcast-modal {
          padding: 0 !important;
          background: #0a0a0a !important;
          border: 1px solid #2e2e2e;
          overflow: hidden;
        }
        .live-broadcast-modal .ant-modal-content,
        .live-broadcast-modal > .ant-modal-section {
          padding: 0 !important;
          background: #0a0a0a !important;
        }
        .live-broadcast-modal .ant-modal-close {
          top: 14px;
          inset-inline-end: 14px;
          z-index: 10;
        }
        @keyframes live-pulse {
          0% { box-shadow: 0 0 0 0 rgba(240,40,73,0.7); }
          100% { box-shadow: 0 0 0 12px rgba(240,40,73,0); }
        }
      `}</style>

      <Flex
        align="center"
        gap={10}
        className="!relative !px-5 !py-3"
        style={{ borderBottom: "1px solid #2e2e2e" }}
      >
        <Flex
          align="center"
          justify="center"
          className="!h-9 !w-9 !rounded-xl"
          style={{ background: gradientBg(["#f02849", "#dc2626"]) }}
        >
          <Icon name="videocam" size={18} color="#fff" />
        </Flex>
        <Flex vertical>
          <Title level={5} className="!m-0 !leading-tight" style={{ color: "#e4e6eb" }}>
            {phase === "live" ? "You're live" : "Go live"}
          </Title>
          <Text className="!text-xs" style={{ color: "#9ca3af" }}>
            {phase === "live"
              ? "Broadcasting to your followers"
              : "Stream video to your friends and followers"}
          </Text>
        </Flex>
      </Flex>

      <div className="!relative !w-full" style={{ background: "#000", aspectRatio: "16 / 9" }}>
        {phase === "idle" && !snapshot && (
          <Flex
            vertical
            align="center"
            justify="center"
            gap={14}
            className="!h-full !w-full !px-6"
          >
            <Flex
              align="center"
              justify="center"
              className="!h-16 !w-16 !rounded-full"
              style={{ background: gradientBg(["#f02849", "#dc2626"]) }}
            >
              <Icon name="videocam" size={32} color="#fff" />
            </Flex>
            <Text className="!text-base !font-bold" style={{ color: "#e4e6eb" }}>
              Camera ready
            </Text>
            <Text
              className="!text-xs !text-center"
              style={{ color: "#9ca3af", maxWidth: 360 }}
            >
              We need access to your camera and microphone to start the broadcast
            </Text>
            {error && (
              <Text className="!text-xs !text-center" style={{ color: "#f87171" }}>
                {error}
              </Text>
            )}
            <Button
              type="primary"
              onClick={startCamera}
              size="large"
              style={{
                background: gradientBg(["#f02849", "#dc2626"]),
                border: "none",
                fontWeight: 700,
                paddingInline: 28,
              }}
              icon={<Icon name="videocam" size={18} color="#fff" />}
            >
              Enable camera
            </Button>
          </Flex>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="!h-full !w-full !object-cover"
          style={{ display: phase === "idle" ? "none" : "block" }}
        />

        {phase === "live" && (
          <>
            <Flex
              align="center"
              gap={6}
              className="!absolute !rounded-md !px-2 !py-1"
              style={{
                top: 14,
                left: 14,
                background: "#f02849",
                animation: "live-pulse 1.5s infinite",
              }}
            >
              <span
                className="!h-2 !w-2 !rounded-full"
                style={{ background: "#fff" }}
              />
              <Text className="!text-[11px] !font-bold !text-white !tracking-wider">
                LIVE
              </Text>
            </Flex>
            <Flex
              align="center"
              gap={4}
              className="!absolute !rounded-md !px-2 !py-1"
              style={{ top: 14, left: 80, background: "rgba(0,0,0,0.6)" }}
            >
              <Icon name="visibility" size={12} color="#fff" />
              <Text className="!text-[11px] !font-semibold !text-white">
                {viewers}
              </Text>
            </Flex>
            <Flex
              align="center"
              className="!absolute !rounded-md !px-2 !py-1"
              style={{ top: 14, right: 56, background: "rgba(0,0,0,0.6)" }}
            >
              <Text className="!text-[11px] !font-semibold !text-white">
                {formatTime(elapsed)}
              </Text>
            </Flex>
          </>
        )}
      </div>

      <Flex vertical gap={12} className="!px-5 !py-4">
        <Flex align="center" gap={10}>
          <Avatar
            size={36}
            style={{ background: gradientBg(CURRENT_USER.gradient), fontWeight: 700 }}
          >
            {CURRENT_USER.initial}
          </Avatar>
          <Flex vertical gap={0}>
            <Text className="!text-sm !font-semibold" style={{ color: "#e4e6eb" }}>
              {CURRENT_USER.name}
            </Text>
            <Flex
              align="center"
              gap={3}
              className="!rounded-full !px-1.5 !py-0.5 !w-fit"
              style={{ background: "#252525" }}
            >
              <Icon name="public" size={11} color="#9ca3af" />
              <Text className="!text-[10px] !font-semibold" style={{ color: "#9ca3af" }}>
                Public
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Input.TextArea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a title to your live video..."
          autoSize={{ minRows: 2, maxRows: 4 }}
          maxLength={150}
          disabled={phase === "live"}
          style={{
            background: "#161616",
            border: "1px solid #2e2e2e",
            color: "#e4e6eb",
            resize: "none",
          }}
        />
        <Flex justify="end" gap={8}>
          <Button
            onClick={cancel}
            style={{ background: "transparent", border: "1px solid #2e2e2e", color: "#e4e6eb" }}
          >
            Cancel
          </Button>
          {phase === "preview" && (
            <Button
              type="primary"
              onClick={goLive}
              icon={<Icon name="sensors" size={16} color="#fff" />}
              style={{
                background: gradientBg(["#f02849", "#dc2626"]),
                border: "none",
                fontWeight: 700,
                paddingInline: 24,
              }}
            >
              Go live
            </Button>
          )}
          {phase === "live" && (
            <Button
              danger
              onClick={endLive}
              icon={<Icon name="stop_circle" size={16} color="#fff" />}
              style={{
                background: "#f02849",
                border: "none",
                fontWeight: 700,
                paddingInline: 24,
                color: "#fff",
              }}
            >
              End live
            </Button>
          )}
        </Flex>
      </Flex>
    </Modal>
  );
}
