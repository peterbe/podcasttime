import React from 'react'

export const Ripple = ({ scale = '2' }) => {
  // Generated on http://loading.io/
  return (
    <div className="uil-ripple-css" style={{transform:'scale(' + scale + ')', textAlign:'center'}}><div></div><div></div></div>
  )
}

export const RippleCentered = ({ scale = 2, margin = 100}) => {
  return (
    <div className="ui centered grid" style={{margin:margin}}>
      <Ripple scale={scale}/>
    </div>
  )
}
