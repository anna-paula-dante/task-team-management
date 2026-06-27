import React from 'react';
import { StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../../theme';

interface Props {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

const Container = styled.View<{ paddingTop: number }>`
  flex: 1;
  background-color: ${colors.background};
  padding-horizontal: ${spacing.md}px;
  padding-top: ${({ paddingTop }) => paddingTop}px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${spacing.lg}px;
`;

const HeaderSide = styled.View`
  width: 44px;
  align-items: center;
`;

const HeaderCenter = styled.View`
  flex: 1;
  align-items: center;
`;

const TitleText = styled.Text`
  color: ${colors.text};
  font-size: ${typography.fontSizeLg}px;
  font-weight: ${typography.fontWeightBold};
  text-align: center;
`;

const SubtitleText = styled.Text`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSizeSm}px;
  text-align: center;
  margin-top: 4px;
`;

export default function ScreenContainer({ children, title, subtitle, headerLeft, headerRight }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Container paddingTop={insets.top + spacing.md}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {(title || headerLeft || headerRight) && (
        <Header>
          <HeaderSide>{headerLeft}</HeaderSide>
          <HeaderCenter>
            {title ? <TitleText>{title}</TitleText> : null}
            {subtitle ? <SubtitleText>{subtitle}</SubtitleText> : null}
          </HeaderCenter>
          <HeaderSide>{headerRight}</HeaderSide>
        </Header>
      )}
      {children}
    </Container>
  );
}
