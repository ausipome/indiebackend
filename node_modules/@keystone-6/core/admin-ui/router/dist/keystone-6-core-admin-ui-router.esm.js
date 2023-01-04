export { Router, useRouter, withRouter } from 'next/router';
import NextLink from 'next/link';

/**
 * This file is exposed by the /router entrypoint, and helps ensure that other
 * packages import the same instance of next's router.
 */
const Link = NextLink;

export { Link };
