'use client';

import React from 'react'
import { useGLTF, Center } from '@react-three/drei'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

export function Model(props) {
  const { nodes, materials } = useGLTF('/models/11-ultra.glb', true, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder)
  })

  return (
    <Center>
      <group {...props} dispose={null} rotation={[-Math.PI / 2, 0, 0]} scale={0.12}>
        <group position={[-93.473, -143.787, -0.04]} scale={0.017}>
          <mesh geometry={nodes.mesh_0.geometry} material={nodes.mesh_0.material} />
          <mesh geometry={nodes.mesh_0_1.geometry} material={nodes.mesh_0_1.material} />
          <mesh geometry={nodes.mesh_0_2.geometry} material={nodes.mesh_0_2.material} />
          <mesh geometry={nodes.mesh_0_3.geometry} material={nodes.mesh_0_3.material} />
          <mesh geometry={nodes.mesh_0_4.geometry} material={nodes.mesh_0_4.material} />
          <mesh geometry={nodes.mesh_0_5.geometry} material={nodes.mesh_0_5.material} />
          <mesh geometry={nodes.mesh_0_6.geometry} material={nodes.mesh_0_6.material} />
          <mesh geometry={nodes.mesh_0_7.geometry} material={nodes.mesh_0_7.material} />
          <mesh geometry={nodes.mesh_0_8.geometry} material={nodes.mesh_0_8.material} />
          <mesh geometry={nodes.mesh_0_9.geometry} material={nodes.mesh_0_9.material} />
          <mesh geometry={nodes.mesh_0_10.geometry} material={nodes.mesh_0_10.material} />
          <mesh geometry={nodes.mesh_0_11.geometry} material={nodes.mesh_0_11.material} />
          <mesh geometry={nodes.mesh_0_12.geometry} material={nodes.mesh_0_12.material} />
          <mesh geometry={nodes.mesh_0_13.geometry} material={nodes.mesh_0_13.material} />
          <mesh geometry={nodes.mesh_0_14.geometry} material={nodes.mesh_0_14.material} />
          <mesh geometry={nodes.mesh_0_15.geometry} material={nodes.mesh_0_15.material} />
          <mesh geometry={nodes.mesh_0_16.geometry} material={nodes.mesh_0_16.material} />
          <mesh geometry={nodes.mesh_0_17.geometry} material={nodes.mesh_0_17.material} />
          <mesh geometry={nodes.mesh_0_18.geometry} material={nodes.mesh_0_18.material} />
          <mesh geometry={nodes.mesh_0_19.geometry} material={nodes.mesh_0_19.material} />
          <mesh geometry={nodes.mesh_0_20.geometry} material={nodes.mesh_0_20.material} />
          <mesh geometry={nodes.mesh_0_21.geometry} material={nodes.mesh_0_21.material} />
          <mesh geometry={nodes.mesh_0_22.geometry} material={nodes.mesh_0_22.material} />
          <mesh geometry={nodes.mesh_0_23.geometry} material={nodes.mesh_0_23.material} />
          <mesh geometry={nodes.mesh_0_24.geometry} material={nodes.mesh_0_24.material} />
          <mesh geometry={nodes.mesh_0_25.geometry} material={nodes.mesh_0_25.material} />
          <mesh geometry={nodes.mesh_0_26.geometry} material={nodes.mesh_0_26.material} />
          <mesh geometry={nodes.mesh_0_27.geometry} material={nodes.mesh_0_27.material} />
          <mesh geometry={nodes.mesh_0_28.geometry} material={nodes.mesh_0_28.material} />
          <mesh geometry={nodes.mesh_0_29.geometry} material={nodes.mesh_0_29.material} />
          <mesh geometry={nodes.mesh_0_30.geometry} material={nodes.mesh_0_30.material} />
          <mesh geometry={nodes.mesh_0_31.geometry} material={nodes.mesh_0_31.material} />
          <mesh geometry={nodes.mesh_0_32.geometry} material={nodes.mesh_0_32.material} />
          <mesh geometry={nodes.mesh_0_33.geometry} material={nodes.mesh_0_33.material} />
          <mesh geometry={nodes.mesh_0_34.geometry} material={nodes.mesh_0_34.material} />
          <mesh geometry={nodes.mesh_0_35.geometry} material={nodes.mesh_0_35.material} />
          <mesh geometry={nodes.mesh_0_36.geometry} material={nodes.mesh_0_36.material} />
          <mesh geometry={nodes.mesh_0_37.geometry} material={nodes.mesh_0_37.material} />
          <mesh geometry={nodes.mesh_0_38.geometry} material={nodes.mesh_0_38.material} />
          <mesh geometry={nodes.mesh_0_39.geometry} material={nodes.mesh_0_39.material} />
          <mesh geometry={nodes.mesh_0_40.geometry} material={nodes.mesh_0_40.material} />
          <mesh geometry={nodes.mesh_0_41.geometry} material={nodes.mesh_0_41.material} />
          <mesh geometry={nodes.mesh_0_42.geometry} material={nodes.mesh_0_42.material} />
          <mesh geometry={nodes.mesh_0_43.geometry} material={nodes.mesh_0_43.material} />
          <mesh geometry={nodes.mesh_0_44.geometry} material={nodes.mesh_0_44.material} />
          <mesh geometry={nodes.mesh_0_45.geometry} material={nodes.mesh_0_45.material} />
          <mesh geometry={nodes.mesh_0_46.geometry} material={nodes.mesh_0_46.material} />
          <mesh geometry={nodes.mesh_0_47.geometry} material={nodes.mesh_0_47.material} />
          <mesh geometry={nodes.mesh_0_48.geometry} material={nodes.mesh_0_48.material} />
          <mesh geometry={nodes.mesh_0_49.geometry} material={nodes.mesh_0_49.material} />
          <mesh geometry={nodes.mesh_0_50.geometry} material={nodes.mesh_0_50.material} />
          <mesh geometry={nodes.mesh_0_51.geometry} material={nodes.mesh_0_51.material} />
          <mesh geometry={nodes.mesh_0_52.geometry} material={nodes.mesh_0_52.material} />
          <mesh geometry={nodes.mesh_0_53.geometry} material={nodes.mesh_0_53.material} />
          <mesh geometry={nodes.mesh_0_54.geometry} material={nodes.mesh_0_54.material} />
          <mesh geometry={nodes.mesh_0_55.geometry} material={nodes.mesh_0_55.material} />
          <mesh geometry={nodes.mesh_0_56.geometry} material={nodes.mesh_0_56.material} />
          <mesh geometry={nodes.mesh_0_57.geometry} material={nodes.mesh_0_57.material} />
          <mesh geometry={nodes.mesh_0_58.geometry} material={nodes.mesh_0_58.material} />
          <mesh geometry={nodes.mesh_0_59.geometry} material={nodes.mesh_0_59.material} />
          <mesh geometry={nodes.mesh_0_60.geometry} material={nodes.mesh_0_60.material} />
          <mesh geometry={nodes.mesh_0_61.geometry} material={nodes.mesh_0_61.material} />
          <mesh geometry={nodes.mesh_0_62.geometry} material={nodes.mesh_0_62.material} />
          <mesh geometry={nodes.mesh_0_63.geometry} material={nodes.mesh_0_63.material} />
          <mesh geometry={nodes.mesh_0_64.geometry} material={nodes.mesh_0_64.material} />
          <mesh geometry={nodes.mesh_0_65.geometry} material={nodes.mesh_0_65.material} />
          <mesh geometry={nodes.mesh_0_66.geometry} material={nodes.mesh_0_66.material} />
          <mesh geometry={nodes.mesh_0_67.geometry} material={nodes.mesh_0_67.material} />
          <mesh geometry={nodes.mesh_0_68.geometry} material={nodes.mesh_0_68.material} />
        </group>
      </group>
    </Center>
  )
}

useGLTF.preload('/models/11-ultra.glb')
