import * as React from 'react';

export default function TabBarLabel(props) {
  return (
    <Text
      style={{ marginBottom: -3}}
      color={props.focused ? '#33c22d' : Colors.tabIconDefault}
    />
  );
}