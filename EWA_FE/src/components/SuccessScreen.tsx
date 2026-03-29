import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, shadows } from '../theme/colors';

interface SuccessScreenProps {
  title: string;
  subtitle?: string;
  amountLabel?: string;
  amount?: string;
  breakdown?: { label: string; value: string }[];
  meta?: { label: string; value: string }[];
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

export default function SuccessScreen({
  title, subtitle, amountLabel, amount, breakdown, meta, primaryAction, secondaryAction,
}: SuccessScreenProps) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.slate900} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Icon Visualization */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#6366f1', '#4338ca']}
            style={styles.mainCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="checkmark" size={48} color="#fff" />
          </LinearGradient>
          
          {/* Decorative floating dots */}
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>

        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        {/* Amount prominently */}
        {amount && (
          <View style={styles.amountBox}>
            <Text style={styles.amountText}>{amount}</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Hoàn thành</Text>
            </View>
          </View>
        )}

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsList}>
            {(breakdown || meta || []).map((item, i) => (
              <View key={i} style={[styles.detailRow, i === 0 && { borderTopWidth: 0 }]}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <View style={styles.detailValueBox}>
                  {item.label.toLowerCase().includes('ngân hàng') && (
                    <MaterialCommunityIcons name="bank" size={14} color={colors.indigo600} style={{ marginRight: 6 }} />
                  )}
                  <Text style={styles.detailValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={primaryAction.onClick} 
            style={styles.primaryBtn} 
            activeOpacity={0.9}
          >
            <Text style={styles.primaryBtnText}>{primaryAction.label}</Text>
          </TouchableOpacity>

          {secondaryAction && (
            <TouchableOpacity 
              onPress={secondaryAction.onClick} 
              style={styles.secondaryBtn} 
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryBtnText}>{secondaryAction.label}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Xác nhận bởi EWApp • 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadows.sm },
  content: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 60 },
  
  iconContainer: { position: 'relative', marginTop: 20, marginBottom: 32 },
  mainCircle: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', ...shadows.primary },
  dot: { position: 'absolute', width: 10, height: 10, borderRadius: 5 },
  dot1: { top: 0, right: -10, backgroundColor: '#cbd5e1' },
  dot2: { bottom: 20, left: -20, backgroundColor: '#6366f1', opacity: 0.4 },
  dot3: { bottom: 10, right: -20, backgroundColor: '#4f46e5' },

  title: { fontSize: 28, fontWeight: '900', color: colors.slate900, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.slate500, textAlign: 'center', marginTop: 8, lineHeight: 22, maxWidth: '80%' },
  
  amountBox: { alignItems: 'center', marginTop: 32, marginBottom: 40 },
  amountText: { fontSize: 44, fontWeight: '900', color: '#4338ca', letterSpacing: -1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginTop: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981', marginRight: 8 },
  statusText: { color: '#10b981', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  
  detailsCard: { width: '100%', backgroundColor: '#fff', borderRadius: 32, padding: 24, ...shadows.sm },
  detailsList: { gap: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  detailLabel: { fontSize: 13, color: colors.slate400, fontWeight: '600' },
  detailValueBox: { flexDirection: 'row', alignItems: 'center' },
  detailValue: { fontSize: 14, color: colors.slate900, fontWeight: '700' },
  
  actions: { width: '100%', gap: 16, marginTop: 40 },
  primaryBtn: { backgroundColor: '#4338ca', paddingVertical: 18, borderRadius: 24, alignItems: 'center', ...shadows.md },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secondaryBtn: { paddingVertical: 16, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  secondaryBtnText: { color: colors.slate600, fontSize: 14, fontWeight: '700' },
  
  footer: { marginTop: 40 },
  footerText: { fontSize: 11, color: colors.slate400, fontWeight: '500', letterSpacing: 0.5 },
});
