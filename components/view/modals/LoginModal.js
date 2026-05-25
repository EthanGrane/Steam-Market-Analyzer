import { Modal, View, Text, TextInput, Pressable, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import { UserIcon } from '../Icons';
import { useState } from 'react';
import { useAuth } from '../../../context/authContext';
import { tryToLogin, tryToLogout } from '../../../services/authServices';
import { Disclaimer } from '../../../assets/ui/components';

const { height } = Dimensions.get('window');

export default function LoginModal({ visible, setVisible }) {
  const { user, profile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const { success, message } = await tryToLogin(email, password);
    if (!success) setError(message);
    setLoading(false);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    await tryToLogout();
    setEmail('');
    setPassword('');
    setLogoutLoading(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)} statusBarTranslucent>
      <Pressable style={s.backdrop} onPress={() => setVisible(false)} />

      <View style={s.wrapper} pointerEvents="box-none">
        <View style={s.modal}>

          {/* Botón cerrar */}
          <Pressable style={s.closeButton} onPress={() => setVisible(false)}>
            <Text style={s.closeButtonText}>✕</Text>
          </Pressable>

          {/* Hero image */}
          <Image
            source={{ uri: profile ? profile.header : null }}
            style={s.heroImage}
            resizeMode="cover"
          />

          <View style={s.body}>
            {user && profile ? (
              // ── VISTA LOGUEADO ──────────────────────────────
              <>
                {/* Avatar */}
                <View style={s.avatarRow}>
                  <View style={s.avatar}>
                    {
                      profile.avatar ? (
                        <Image
                          source={{ uri: profile.avatar }}
                          style={{ width: 48, height: 48, borderRadius: 24, objectFit: 'contain' }}
                        />
                      ) : (
                        <UserIcon size={24} color="#8b93a7" />
                      )
                    }
                  </View>
                  <View>
                    <Text style={s.title}>{profile ? profile.username : ""}</Text>
                    <Text style={s.appId}>{user.email}</Text>
                  </View>
                </View>

                {/* Info rows */}
                <View style={s.section}>
                  <Text style={s.sectionTitle}>Account Info</Text>
                  <View style={s.infoRow}>
                    <Text style={s.infoLabel}>Email</Text>
                    <Text style={s.infoValue}>{user.email}</Text>
                  </View>
                  <View style={s.infoRow}>
                    <Text style={s.infoLabel}>Member since</Text>
                    <Text style={s.infoValue}>{new Date(user.created_at).toLocaleDateString()}</Text>
                  </View>

                </View>

                {/* Sign out */}
                <View style={s.section}>
                  <Text style={s.sectionTitle}>Session</Text>
                  <Pressable
                    style={({ pressed }) => [
                      s.logoutButton,
                      pressed && s.buttonPressed,
                      logoutLoading && s.buttonLoading,
                    ]}
                    onPress={handleLogout}
                    disabled={logoutLoading}
                  >
                    {logoutLoading
                      ? <ActivityIndicator size="small" color="#A32D2D" />
                      : <Text style={s.logoutText}>Sign out</Text>
                    }
                  </Pressable>
                </View>
              </>
            ) : (
              // ── VISTA LOGIN ─────────────────────────────────
              <>
                <Text style={s.title}>Sign in</Text>
                <Text style={s.appId}>Access your Steam Stats Explorer account</Text>

                <Disclaimer>
                  Account creation is disabled; access is by invitation only.
                </Disclaimer>

                <View style={s.section}>
                  <Text style={s.sectionTitle}>Credentials</Text>
                  <TextInput
                    style={s.input}
                    placeholder="Email"
                    placeholderTextColor="#555e72"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <TextInput
                    style={[s.input, { marginTop: 8 }]}
                    placeholder="Password"
                    placeholderTextColor="#555e72"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  {error ? <Text style={s.errorText}>{error}</Text> : null}
                </View>

                <View style={s.section}>
                  <Pressable
                    style={({ pressed }) => [
                      s.loginButton,
                      pressed && s.buttonPressed,
                      loading && s.buttonLoading,
                    ]}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    {loading
                      ? <ActivityIndicator size="small" color="#4a90d9" />
                      : <Text style={s.loginText}>Sign in</Text>
                    }
                  </Pressable>
                </View>
              </>
            )}
          </View>

        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.78)' },
  wrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 40 },
  modal: { width: '100%', maxHeight: height * 0.75, backgroundColor: '#0f1318', borderRadius: 16, borderWidth: 1, borderColor: '#222838', overflow: 'hidden' },

  closeButton: { position: 'absolute', top: 12, right: 12, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  heroImage: { width: '100%', height: 140 },

  body: { padding: 16, gap: 4 },
  title: { color: '#ffffff', fontSize: 20, fontWeight: '700', marginBottom: 2 },
  appId: { color: '#555e72', fontSize: 11, marginBottom: 12, fontFamily: 'monospace' },

  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#151922', borderWidth: 1, borderColor: '#222838', alignItems: 'center', justifyContent: 'center' },

  section: { marginTop: 16, gap: 8 },
  sectionTitle: { color: '#4a90d9', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: '#1c2333', paddingBottom: 4 },

  infoRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginBottom: 4 },
  infoLabel: { color: '#555e72', fontSize: 12, width: 90 },
  infoValue: { color: '#9aa3b5', fontSize: 12, flex: 1 },

  input: { backgroundColor: '#151922', borderRadius: 8, borderWidth: 1, borderColor: '#222838', padding: 12, color: '#fff', fontSize: 13 },
  errorText: { color: '#A32D2D', fontSize: 12, marginTop: 4 },

  loginButton: { backgroundColor: '#151922', borderRadius: 8, borderWidth: 1, borderColor: '#2a3348', paddingVertical: 12, alignItems: 'center' },
  loginText: { color: '#4a90d9', fontSize: 13, fontWeight: '500' },

  logoutButton: { backgroundColor: '#151922', borderRadius: 8, borderWidth: 1, borderColor: '#3d1515', paddingVertical: 12, alignItems: 'center' },
  logoutText: { color: '#A32D2D', fontSize: 13, fontWeight: '500' },

  loginButton: { backgroundColor: '#151922', borderRadius: 8, borderWidth: 1, borderColor: '#2a3348', paddingVertical: 12, alignItems: 'center', height: 42, justifyContent: 'center' },
  logoutButton: { backgroundColor: '#151922', borderRadius: 8, borderWidth: 1, borderColor: '#3d1515', paddingVertical: 12, alignItems: 'center', height: 42, justifyContent: 'center' },
  buttonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  buttonLoading: { opacity: 0.5 },
});