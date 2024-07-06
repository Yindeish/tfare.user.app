import { ImageStyle } from "react-native";

type ImageStyleProp = Record<string, ImageStyle>;

export const { wHFull, mXAuto, }: ImageStyleProp = {
    wHFull: {
        width: '100%',
        height: '100%'
    },
    mXAuto: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    mYAuto: {
        marginTop: 'auto',
        marginBottom: 'auto'
    }
}

// FS -> Functional Styles
// VFS -> View FS
// VFS -> Text FS
type VFS = <T extends number | string >(val: T) => ImageStyle;
type VFSProp = { w: VFS, h: VFS, t: VFS, l: VFS, r: VFS, b: VFS, bg: VFS, zIndex: VFS, gap: VFS, m: VFS, mx: VFS, my: VFS, mt: VFS, mb: VFS, ml: VFS, mr: VFS, p: VFS, px: VFS, py: VFS, pt: VFS, pb: VFS, pl: VFS, pr: VFS, rounded: VFS };

export const image: VFSProp = {
    w: (val) => {
        return {
            width: val as number
        }
    },
    h: (val) => {
        return {
            height: val as number
        }
    },
    t: (val) => {
        return {
            top: val as number
        }
    },
    l: (val) => {
        return {
            left: val as number
        }
    },
    r: (val) => {
        return {
            right: val as number
        }
    },
    b: (val) => {
        return {
            bottom: val as number
        }
    },
    bg: (val) => {
        return {
            backgroundColor: val as string
        }
    },
    zIndex: (val) => {
        return {
            zIndex: val as number
        }
    },
    gap: (val) => {
        return {
            gap: val as number
        }
    },
    m: (val) => {
        return {
            margin: val as number
        }
    },
    mx: (val) => {
        return {
            marginLeft: val as number,
            marginRight: val as number,
        }
    },
    my: (val) => {
        return {
            marginTop: val as number,
            marginBottom: val as number,
        }
    },
    mt: (val) => {
        return {
            marginTop: val as number
        }
    },
    mb: (val) => {
        return {
            marginBottom: val as number
        }
    },
    ml: (val) => {
        return {
            marginLeft: val as number
        }
    },
    mr: (val) => {
        return {
            marginRight: val as number
        }
    },
    p: (val) => {
        return {
            padding: val as number
        }
    },
    px: (val) => {
        return {
            paddingLeft: val as number,
            paddingRight: val as number,
        }
    },
    py: (val) => {
        return {
            paddingTop: val as number,
            paddingBottom: val as number,
        }
    },
    pt: (val) => {
        return {
            paddingTop: val as number
        }
    },
    pb: (val) => {
        return {
            paddingBottom: val as number
        }
    },
    pl: (val) => {
        return {
            paddingLeft: val as number
        }
    },
    pr: (val) => {
        return {
            paddingRight: val as number
        }
    },
    rounded: (val) => {
        return {
            borderRadius: val as number
        }
    },
}