import React from 'react'

const SettingHeader = () => (
    <header>
    <h2 className="text-lg">{title}</h2>
    <p className="text-sm text-muted-foreground">
      {desc}
    </p>
  </header>  
)

export default SettingHeader