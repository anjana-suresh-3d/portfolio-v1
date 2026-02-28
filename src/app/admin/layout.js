import AuthProvider from '@/components/ui/AuthProvider';

export default function AdminLayout({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
}
