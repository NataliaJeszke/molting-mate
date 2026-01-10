import React, { useEffect, useState, useRef } from "react";
import { View, PanResponder, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "./ThemedText";
import { useUserStore } from "@/store/userStore";
import { Colors, ThemeType } from "@/constants/Colors";

type Props = {
  min?: number;
  max?: number;
  step?: number;
  initialValues?: [number, number];
  label?: string;
  onChange: (values: [number, number]) => void;
  allowSameValue?: boolean;
};

const SLIDER_WIDTH = Dimensions.get("window").width * 0.9;
const THUMB_SIZE = 24;
const TRACK_HEIGHT = 2;
const ACTIVE_TRACK_HEIGHT = 4;

export const ThemedRangeSlider = ({
  min = 0,
  max = 20,
  step = 1,
  initialValues = [0, 20],
  label,
  onChange,
  allowSameValue = true,
}: Props) => {
  const { currentTheme } = useUserStore();
  const [from, setFrom] = useState(initialValues[0]);
  const [to, setTo] = useState(initialValues[1]);
  const [lastMovedThumb, setLastMovedThumb] = useState<"from" | "to" | null>(
    null,
  );

  const prevInitialValues = useRef(initialValues);

  useEffect(() => {
    const [newFrom, newTo] = initialValues;
    const [oldFrom, oldTo] = prevInitialValues.current;

    if (newFrom !== oldFrom || newTo !== oldTo) {
      setFrom(newFrom);
      setTo(newTo);
      prevInitialValues.current = initialValues;
    }
  }, [initialValues]);

  const positionFrom = ((from - min) / (max - min)) * SLIDER_WIDTH;
  const positionTo = ((to - min) / (max - min)) * SLIDER_WIDTH;

  const stepPixels = SLIDER_WIDTH / ((max - min) / step);

  const panFrom = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setLastMovedThumb("from");
    },
    onPanResponderMove: (_, gesture) => {
      const newPos = Math.min(
        allowSameValue ? positionTo : positionTo - stepPixels,
        Math.max(0, positionFrom + gesture.dx),
      );
      const value = Math.round((newPos / SLIDER_WIDTH) * (max - min) + min);
      if (value >= min && value <= (allowSameValue ? to : to - step)) {
        setFrom(value);
      }
    },
    onPanResponderRelease: () => {
      onChange([from, to]);
    },
  });

  const panTo = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setLastMovedThumb("to");
    },
    onPanResponderMove: (_, gesture) => {
      const newPos = Math.max(
        allowSameValue ? positionFrom : positionFrom + stepPixels,
        Math.min(SLIDER_WIDTH, positionTo + gesture.dx),
      );
      const value = Math.round((newPos / SLIDER_WIDTH) * (max - min) + min);
      if (value <= max && value >= (allowSameValue ? from : from + step)) {
        setTo(value);
      }
    },
    onPanResponderRelease: () => {
      onChange([from, to]);
    },
  });

  const getZIndex = (thumb: "from" | "to") => {
    if (from === to) {
      return thumb === lastMovedThumb ? 3 : 2;
    }
    return 2;
  };

  return (
    <View style={styles(currentTheme)["range-slider"]}>
      <ThemedText style={styles(currentTheme)["range-slider__label"]}>
        {label}: {from} - {to}
      </ThemedText>

      <View style={styles(currentTheme)["range-slider__container"]}>
        <View style={styles(currentTheme)["range-slider__track"]} />
        <View
          style={[
            styles(currentTheme)["range-slider__track--selected"],
            {
              left: positionFrom,
              width: Math.max(positionTo - positionFrom, 1),
            },
          ]}
        />

        <View
          style={[
            styles(currentTheme)["range-slider__track--active"],
            {
              left: positionFrom,
              width: Math.max(positionTo - positionFrom, 1),
            },
          ]}
        />

        <View
          style={[
            styles(currentTheme)["range-slider__thumb"],
            {
              left: positionFrom - THUMB_SIZE / 2,
              zIndex: getZIndex("from"),
            },
          ]}
          {...panFrom.panHandlers}
        />

        <View
          style={[
            styles(currentTheme)["range-slider__thumb"],
            {
              left: positionTo - THUMB_SIZE / 2,
              zIndex: getZIndex("to"),
            },
          ]}
          {...panTo.panHandlers}
        />
      </View>
    </View>
  );
};

/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    "range-slider": {
      alignItems: "center",
      marginVertical: 24,
    },
    "range-slider__label": {
      marginBottom: 8,
      fontSize: 16,
      fontWeight: "500",
      color: Colors[theme].text || "#2e1a47",
    },
    "range-slider__container": {
      width: SLIDER_WIDTH,
      height: THUMB_SIZE,
      justifyContent: "center",
    },
    "range-slider__track": {
      height: TRACK_HEIGHT,
      backgroundColor: Colors[theme].input.borderColor || "#e6e0ed",
      position: "absolute",
      left: 0,
      right: 0,
      borderRadius: TRACK_HEIGHT / 1,
    },
    "range-slider__track--selected": {
      height: TRACK_HEIGHT,
      backgroundColor: Colors[theme].input.borderColor || "#2e1a47",
      position: "absolute",
      borderRadius: TRACK_HEIGHT / 1,
      top: (THUMB_SIZE - TRACK_HEIGHT) / 2,
    },
    "range-slider__track--active": {
      height: ACTIVE_TRACK_HEIGHT,
      backgroundColor: Colors[theme].input.borderColor || "#4caf50",
      position: "absolute",
      borderRadius: ACTIVE_TRACK_HEIGHT / 1,
      top: (THUMB_SIZE - ACTIVE_TRACK_HEIGHT) / 2,
      opacity: 0.8,
      zIndex: 1,
    },
    "range-slider__thumb": {
      position: "absolute",
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: THUMB_SIZE / 1,
      backgroundColor: Colors[theme].input.backgroundColor || "#2e1a47",
      borderWidth: 2,
      borderColor: Colors[theme].input.borderColor || "#fff",
      elevation: 3,
    },
  });
