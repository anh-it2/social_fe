"use client";

import { App, Avatar, Button, Flex, Input, Typography } from "antd";
import { DarkModal } from "@/shared/components/modal/DarkModal";
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

const LIVE_GRADIENT: [string, string] = ["#f02849", "#dc2626"];

export function LiveBroadcastModal({ open, onClose, onSubmit }: LiveBroadcastModalProps) {
  const { message } = App.useApp();
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
      message.success("Camera enabled");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Camera access denied";
      setError(msg);
      message.error(msg);
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
    message.success("Broadcast started");
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
    message.success("Broadcast ended and saved");
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
    <DarkModal
      open={open}
      onCancel={cancel}
      width={720}
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
    >
      <Flex
        align="center"
        gap={10}
        className="!relative !px-5 !py-3"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <Flex
          align="center"
          justify="center"
          className="!h-9 !w-9 !rounded-xl"
          style={{ background: gradientBg(LIVE_GRADIENT) }}
        >
          <Icon name="videocam" size={18} color="#fff" />
        </Flex>
        <Flex vertical>
          <Title level={5} className="!m-0 !leading-tight" style={{ color: "var(--color-text)" }}>
            {phase === "live" ? "You're live" : "Go live"}
          </Title>
          <Text className="!text-xs" style={{ color: "var(--color-text-muted)" }}>
            {phase === "live"
              ? "Broadcasting to your followers"
              : "Stream video to your friends and followers"}
          </Text>
        </Flex>
      </Flex>

      <div
        className="!relative !w-full"
        style={{
          background: phase === "idle" ? "var(--color-bg)" : "#000",
          aspectRatio: "16 / 9",
        }}
      >
        {phase === "idle" && !snapshot && (
          <Flex
            vertical
            align="center"
            justify="center"
            gap={16}
            className="!h-full !w-full !px-6"
          >
            <Flex
              align="center"
              justify="center"
              className="!h-20 !w-20 !rounded-full"
              style={{ background: gradientBg(LIVE_GRADIENT) }}
            >
              <Icon name="videocam" size={40} color="#fff" />
            </Flex>
            <Text
              className="!text-xl !font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Camera ready
            </Text>
            <Text
              className="!text-sm !text-center"
              style={{ color: "var(--color-text-muted)", maxWidth: 360 }}
            >
              We need access to your camera and microphone to start the broadcast
            </Text>
            {error && (
              <Text
                className="!text-sm !text-center"
                style={{ color: "var(--color-error)" }}
              >
                {error}
              </Text>
            )}
            <Button
              type="primary"
              onClick={startCamera}
              size="large"
              className="!font-bold !px-7 !text-base"
              style={{
                background: gradientBg(LIVE_GRADIENT),
                border: "none",
              }}
              icon={<Icon name="videocam" size={20} color="#fff" />}
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
              className="!absolute !top-3.5 !left-3.5 !rounded-md !px-2 !py-1"
              style={{
                background: "#f02849",
                animation: "live-pulse 1.5s infinite",
              }}
            >
              <span className="!h-2 !w-2 !rounded-full !bg-white" />
              <Text className="!text-[11px] !font-bold !text-white !tracking-wider">
                LIVE
              </Text>
            </Flex>
            <Flex
              align="center"
              gap={4}
              className="!absolute !top-3.5 !rounded-md !px-2 !py-1"
              style={{ left: 80, background: "rgba(0,0,0,0.6)" }}
            >
              <Icon name="visibility" size={12} color="#fff" />
              <Text className="!text-[11px] !font-semibold !text-white">
                {viewers}
              </Text>
            </Flex>
            <Flex
              align="center"
              className="!absolute !top-3.5 !rounded-md !px-2 !py-1"
              style={{ right: 14, background: "rgba(0,0,0,0.6)" }}
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
            <Text className="!text-sm !font-semibold" style={{ color: "var(--color-text)" }}>
              {CURRENT_USER.name}
            </Text>
            <Flex
              align="center"
              gap={3}
              className="!rounded-full !px-1.5 !py-0.5 !w-fit"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <Icon name="public" size={11} color="var(--color-text-muted)" />
              <Text
                className="!text-[10px] !font-semibold"
                style={{ color: "var(--color-text-muted)" }}
              >
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
            background: "var(--color-bg-tertiary)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
            resize: "none",
          }}
        />
        <Flex justify="end" gap={8}>
          <Button
            onClick={cancel}
            style={{
              background: "transparent",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            Cancel
          </Button>
          {phase === "preview" && (
            <Button
              type="primary"
              onClick={goLive}
              icon={<Icon name="sensors" size={16} color="#fff" />}
              className="!font-bold !px-6"
              style={{
                background: gradientBg(LIVE_GRADIENT),
                border: "none",
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
              className="!font-bold !px-6 !text-white"
              style={{
                background: "#f02849",
                border: "none",
              }}
            >
              End live
            </Button>
          )}
        </Flex>
      </Flex>
    </DarkModal>
  );
}
