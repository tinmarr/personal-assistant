import { AuthError, SupabaseClient, createClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

const ensureAuth = () => {
    if (!supabase) {
        supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);
    }
}

const handleError = (error: AuthError | null) => {
    if (error) {
        console.error(`${error.name}\n${error.message}`);
    }
}

export const signIn = async () => {
    ensureAuth();
    const { error } = await supabase!.auth.signInWithOAuth({
        provider: "google",
        options: {
            scopes: "https://www.googleapis.com/auth/calendar"
        }
    });
    handleError(error);
}

export const signOut = async () => {
    ensureAuth();
    const { error } = await supabase!.auth.signOut();
    handleError(error);
}

export const getSession = async () => {
    ensureAuth();
    const { data, error } = await supabase!.auth.getSession()
    handleError(error)
    return data.session
}

type UpdateUserData = {
    name?: string;
}

export const updateUser = async (user: UpdateUserData) => {
    ensureAuth();
    const { error } = await supabase!.auth.updateUser({
        data: user
    });
    handleError(error);
}

type UserData = {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    name: string;
}

export const getUserData = async () => {
    let session = await getSession();
    if (!session) return null;
    return session.user.user_metadata as UserData;
}
