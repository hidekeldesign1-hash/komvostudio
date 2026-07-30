"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "komvos-sound-enabled";
const listeners = new Set<() => void>();

let enabled = false;
let initialized = false;
let audioContext: AudioContext | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function initialize() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  enabled = window.localStorage.getItem(STORAGE_KEY) === "true";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  initialize();
  return enabled;
}

function getServerSnapshot() {
  return false;
}

function setEnabled(nextEnabled: boolean) {
  enabled = nextEnabled;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, String(nextEnabled));
  }
  emit();
}

function playPulse(force = false) {
  if ((!enabled && !force) || typeof window === "undefined") return;

  const AudioContextClass =
    window.AudioContext ??
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;
  if (!AudioContextClass) return;

  audioContext ??= new AudioContextClass();
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, now);
  oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.12);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.05, now + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.15);
}

export function useSound() {
  const soundEnabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggleSound = () => {
    const nextEnabled = !soundEnabled;
    setEnabled(nextEnabled);
    if (nextEnabled) playPulse(true);
  };

  return {
    enabled: soundEnabled,
    toggle: toggleSound,
    playPulse: () => playPulse(),
  };
}
