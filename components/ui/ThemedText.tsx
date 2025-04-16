import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useUserStore } from '@/store/userStore';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const { currentTheme } = useUserStore(); 
  let color;
  if (currentTheme === 'light') {
    switch (type) {
      case 'default':
        color = lightColor || '#000000';
        break;
      case 'title':
        color = lightColor || '#2E2E2E';
        break;
      case 'defaultSemiBold':
        color = lightColor || '#333333';
        break;
      case 'subtitle':
        color = lightColor || '#4A4A4A';
        break;
      case 'link':
        color = lightColor || '#007BFF';
        break;
      default:
        color = lightColor || '#1C1C1C';
    }
  } else {
    switch (type) {
      case 'default':
        color = darkColor || '#FFFFFF';
        break;
      case 'title':
        color = darkColor || '#E0E0E0';
        break;
      case 'defaultSemiBold':
        color = darkColor || '#CCCCCC';
        break;
      case 'subtitle':
        color = darkColor || '#B0B0B0';
        break;
      case 'link':
        color = darkColor || '#1E90FF';
        break;
      default:
        color = darkColor || '#FFFFFF';
    }
  }

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 20,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 20,
    color: '#0a7ea4',
  },
});
