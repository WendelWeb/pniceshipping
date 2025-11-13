import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import { NewsItem } from '../types';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
} from '../constants/theme';

// Function to get translated news data
const getNewsData = (t: any): NewsItem[] => [
  {
    id: '1',
    title: t('news.article1Title'),
    description: t('news.article1Description'),
    date: '2025-10-10',
    category: 'update',
  },
  {
    id: '2',
    title: t('news.article2Title'),
    description: t('news.article2Description'),
    date: '2025-10-08',
    category: 'promo',
  },
  {
    id: '3',
    title: t('news.article3Title'),
    description: t('news.article3Description'),
    date: '2025-10-05',
    category: 'info',
  },
  {
    id: '4',
    title: t('news.article4Title'),
    description: t('news.article4Description'),
    date: '2025-10-01',
    category: 'update',
  },
];

export default function NewsScreen() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState<NewsItem[]>(getNewsData(t));

  // Update news when language changes
  React.useEffect(() => {
    setNews(getNewsData(t));
  }, [t]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setNews(getNewsData(t));
      setRefreshing(false);
    }, 1500);
  }, [t]);

  const getCategoryColor = (category: NewsItem['category']) => {
    const colors = {
      update: COLORS.accent.blue,
      promo: COLORS.accent.orange,
      info: COLORS.accent.teal,
      alert: COLORS.status.error,
    };
    return colors[category];
  };

  const getCategoryIcon = (category: NewsItem['category']) => {
    const icons: Record<NewsItem['category'], keyof typeof Ionicons.glyphMap> = {
      update: 'rocket',
      promo: 'pricetag',
      info: 'information-circle',
      alert: 'warning',
    };
    return icons[category];
  };

  const getCategoryLabel = (category: NewsItem['category']) => {
    const labels = {
      update: t('news.categoryUpdate'),
      promo: t('news.categoryPromo'),
      info: t('news.categoryInfo'),
      alert: t('news.categoryAlert'),
    };
    return labels[category];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderNewsItem = ({ item, index }: { item: NewsItem; index: number }) => {
    const categoryColor = getCategoryColor(item.category);

    return (
      <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
        <Card blur={false} style={styles.newsCard}>
          <View style={styles.newsHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
              <Ionicons
                name={getCategoryIcon(item.category)}
                size={16}
                color={categoryColor}
              />
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {getCategoryLabel(item.category)}
              </Text>
            </View>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
          </View>

          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsDescription}>{item.description}</Text>

          {item.image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.newsImage} />
            </View>
          )}
        </Card>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background.primary, COLORS.gray[900]]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{t('news.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('news.subtitle')}</Text>
          </View>
          <View style={styles.notificationIcon}>
            <Ionicons name="notifications" size={24} color={COLORS.text.secondary} />
          </View>
        </View>

        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.accent.blue}
              colors={[COLORS.accent.blue]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="newspaper-outline" size={64} color={COLORS.text.tertiary} />
              <Text style={styles.emptyText}>{t('news.emptyMessage')}</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs / 2,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.tertiary,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  newsCard: {
    marginBottom: SPACING.base,
    padding: SPACING.lg,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    marginLeft: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.tertiary,
  },
  newsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  newsDescription: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  imageContainer: {
    marginTop: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 180,
    borderRadius: BORDER_RADIUS.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['5xl'],
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.tertiary,
    marginTop: SPACING.lg,
  },
});
