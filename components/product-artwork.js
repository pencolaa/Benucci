import { Image, StyleSheet, View } from 'react-native';

export default function ProductArtwork({ item, large = false }) {
  if (item.shape === 'circle') {
    return (
      <View
        style={[
          styles.artCircle,
          large && styles.artCircleLarge,
          { borderColor: item.accent },
        ]}>
        <View
          style={[
            styles.artCircleInner,
            large && styles.artCircleInnerLarge,
            { backgroundColor: item.accent },
          ]}>
          <Image
            source={require('../assets/images/logo.png')}
            style={[styles.artLogo, large && styles.artLogoLarge]}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }

  if (item.shape === 'arch') {
    return (
      <View style={[styles.artArchWrap, large && styles.artArchWrapLarge]}>
        <View style={[styles.artArchBase, large && styles.artArchBaseLarge, { backgroundColor: item.accent }]} />
        <View style={[styles.artArchBand, large && styles.artArchBandLarge, { backgroundColor: '#315fb4' }]} />
        <View
          style={[styles.artArchBandTop, large && styles.artArchBandTopLarge, { backgroundColor: '#d6532b' }]}
        />
      </View>
    );
  }

  if (item.shape === 'drop') {
    return (
      <View style={[styles.artKeychainWrap, large && styles.artKeychainWrapLarge]}>
        <View style={[styles.artRing, large && styles.artRingLarge]} />
        <View style={[styles.artPendant, large && styles.artPendantLarge, { backgroundColor: item.accent }]}>
          <Image
            source={require('../assets/images/logo.png')}
            style={[styles.artPendantLogo, large && styles.artPendantLogoLarge]}
            resizeMode="contain"
          />
        </View>
        <View style={[styles.artTassel, large && styles.artTasselLarge]} />
      </View>
    );
  }

  return (
    <View style={[styles.artCatWrap, large && styles.artCatWrapLarge]}>
      <View style={[styles.artCatBody, large && styles.artCatBodyLarge, { backgroundColor: item.accent }]} />
      <View style={[styles.artCatHead, large && styles.artCatHeadLarge, { backgroundColor: item.accent }]} />
      <View style={[styles.artCatTail, large && styles.artCatTailLarge, { borderColor: item.accent }]} />
      <Image
        source={require('../assets/images/logo.png')}
        style={[styles.artCatLogo, large && styles.artCatLogoLarge]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  artCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#245e95',
  },
  artCircleLarge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
  },
  artCircleInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artCircleInnerLarge: {
    width: 132,
    height: 132,
    borderRadius: 66,
  },
  artLogo: {
    width: 42,
    height: 42,
  },
  artLogoLarge: {
    width: 90,
    height: 90,
  },
  artArchWrap: {
    width: 86,
    height: 54,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  artArchWrapLarge: {
    width: 180,
    height: 112,
  },
  artArchBase: {
    width: 86,
    height: 42,
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
  },
  artArchBaseLarge: {
    width: 180,
    height: 88,
    borderTopLeftRadius: 92,
    borderTopRightRadius: 92,
  },
  artArchBand: {
    position: 'absolute',
    width: 74,
    height: 18,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    bottom: 8,
  },
  artArchBandLarge: {
    width: 154,
    height: 36,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    bottom: 16,
  },
  artArchBandTop: {
    position: 'absolute',
    width: 66,
    height: 12,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    bottom: 18,
  },
  artArchBandTopLarge: {
    width: 138,
    height: 24,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    bottom: 38,
  },
  artKeychainWrap: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artKeychainWrapLarge: {
    width: 160,
    height: 170,
  },
  artRing: {
    position: 'absolute',
    top: 2,
    left: 28,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#d7b98f',
  },
  artRingLarge: {
    top: 8,
    left: 58,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
  },
  artPendant: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artPendantLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginTop: 18,
  },
  artPendantLogo: {
    width: 30,
    height: 30,
  },
  artPendantLogoLarge: {
    width: 58,
    height: 58,
  },
  artTassel: {
    width: 10,
    height: 34,
    backgroundColor: '#db5631',
    marginTop: -2,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    transform: [{ rotate: '22deg' }],
  },
  artTasselLarge: {
    width: 16,
    height: 60,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  artCatWrap: {
    width: 94,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artCatWrapLarge: {
    width: 164,
    height: 170,
  },
  artCatBody: {
    width: 48,
    height: 54,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    transform: [{ skewY: '-8deg' }],
  },
  artCatBodyLarge: {
    width: 84,
    height: 92,
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  artCatHead: {
    position: 'absolute',
    top: 18,
    width: 30,
    height: 30,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    transform: [{ rotate: '-14deg' }],
  },
  artCatHeadLarge: {
    top: 28,
    width: 50,
    height: 50,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  artCatTail: {
    position: 'absolute',
    right: 12,
    top: 26,
    width: 26,
    height: 42,
    borderWidth: 4,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 30,
    transform: [{ rotate: '12deg' }],
  },
  artCatTailLarge: {
    right: 18,
    top: 44,
    width: 40,
    height: 68,
    borderWidth: 6,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 46,
  },
  artCatLogo: {
    position: 'absolute',
    width: 32,
    height: 32,
    top: 40,
  },
  artCatLogoLarge: {
    width: 54,
    height: 54,
    top: 66,
  },
});
