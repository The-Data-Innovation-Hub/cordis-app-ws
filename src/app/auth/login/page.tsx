'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get any redirect parameters from the current URL
    const redirectedFrom = searchParams.get('redirectedFrom');
    const message = searchParams.get('message');

    // Construct the new URL with the same parameters
    const redirectUrl = `/sign-in${redirectedFrom ? `?redirectedFrom=${redirectedFrom}` : ''}${message ? `${redirectedFrom ? '&' : '?'}message=${message}` : ''}`;

    // Redirect to the new sign-in page
    router.replace(redirectUrl);
  }, [router, searchParams]);

  // Return null as this is just a redirect page
  return null;
}
