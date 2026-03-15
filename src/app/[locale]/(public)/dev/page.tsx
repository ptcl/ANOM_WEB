import Container from '@/components/commun/container'
import WindowContainerStatic from '@/components/desktop/windows/WindowContainerStatic'
import ComponentSvg from '@/components/svg/ComponentSvg'
import React from 'react'

export default function page() {
    return (
        <>
            <Container bgDefault>

                <WindowContainerStatic responsiveMode='fullscreen' windowContainerId={3} height={600} width={800} title="DEV PAGE" icon={<ComponentSvg variant='cat' color='var(--windows-icon)' height={24} width={24} />}>

                    <div>page</div>
                </WindowContainerStatic>
            </Container>
        </>
    )
}
