import VexCustomFont from '@/components/cipher/vex'
import Container from '@/components/commun/container'
import ImageLueur from '@/components/commun/ImageLueur'
import React from 'react'

export default function page() {
    return (
        <>
            <Container height='fit' pb textAlign='center'>
                <ImageLueur />
                <VexCustomFont />
            </Container>
        </>
    )
}
