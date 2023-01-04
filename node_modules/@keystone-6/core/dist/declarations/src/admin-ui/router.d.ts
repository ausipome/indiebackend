/**
 * This file is exposed by the /router entrypoint, and helps ensure that other
 * packages import the same instance of next's router.
 */
/// <reference types="node" />
export { Router, useRouter, withRouter } from 'next/router';
export type { NextRouter } from 'next/router';
import { LinkProps as NextLinkProps } from 'next/link';
import { AnchorHTMLAttributes } from 'react';
export declare type LinkProps = NextLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;
export declare const Link: import("react").ForwardRefExoticComponent<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof {
    href: string | import("url").UrlObject;
    as?: (string | import("url").UrlObject) | undefined;
    replace?: boolean | undefined;
    scroll?: boolean | undefined;
    shallow?: boolean | undefined;
    passHref?: boolean | undefined;
    prefetch?: boolean | undefined;
    locale?: string | false | undefined;
    legacyBehavior?: boolean | undefined;
    onMouseEnter?: ((e: any) => void) | undefined;
    onTouchStart?: ((e: any) => void) | undefined;
    onClick?: ((e: any) => void) | undefined;
}> & {
    href: string | import("url").UrlObject;
    as?: (string | import("url").UrlObject) | undefined;
    replace?: boolean | undefined;
    scroll?: boolean | undefined;
    shallow?: boolean | undefined;
    passHref?: boolean | undefined;
    prefetch?: boolean | undefined;
    locale?: string | false | undefined;
    legacyBehavior?: boolean | undefined;
    onMouseEnter?: ((e: any) => void) | undefined;
    onTouchStart?: ((e: any) => void) | undefined;
    onClick?: ((e: any) => void) | undefined;
} & {
    children?: import("react").ReactNode;
} & import("react").RefAttributes<HTMLAnchorElement>>;
