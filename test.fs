
// 一定要记得点分号啊！！！！

// 顶点着色器
// 设置浮点数精度为中等精度
precision mediump float;
// 接收点在canvas坐标系上的坐标（x,y）
attribute vec2 a_Position;
// 接收canvas的宽高尺寸
attribute vec2 a_Screen_Size;
// 接收JavaScript传递的顶点颜色
attribute vec4 a_Color;
// 传往片元着色器的颜色
varying vec4 v_Color;
void main(){
  // 将屏幕坐标系改为裁剪坐标（裁剪坐标系）
  vec2 position=(a_Position/a_Screen_Size)*2.-1.;
  position=position*vec2(1.,-1.);
  // 声明顶点位置
  gl_Position=vec4(position,0.,1.);
  // 声明待绘制点的大小
  gl_PointSize=10.;
  
  v_Color=a_Color
}

// 片元着色器
// 设置浮点数精度为中等精度
precision mediump float;
// 接收JavaScript传过来的颜色值（rgba）
varying vec4 v_Color
void main(){
  // 将普通的颜色表示转化为WebGL需要的表达式
  vec4 color=v_Color/vec4(255,255,255,1);
  gl_FragColor=color;
}

// 顶点着色器
// 设置浮点数精度为中等精度
precision mediump float;
attribute vec2 a_Position;
void main(){
  gl_Position=vec4(a_Position,0.,1.);
}

// 顶点着色器
// 设置浮点数精度为中等精度
precision mediump float;
// 接收点在canvas坐标系上的坐标（x,y）
attribute vec2 a_Position;
// 接收canvas的宽高尺寸
attribute vec2 a_Screen_Size;
// 接收JavaScript传递的顶点uv坐标
attribute vec2 a_Uv;
// 将接收的uv坐标传递给片元着色器
varying vec2 v_Uv;
void main(){
  // 将屏幕坐标系改为裁剪坐标（裁剪坐标系）
  vec2 position=(a_Position/a_Screen_Size)*2.-1.;
  position=position*vec2(1.,-1.);
  // 声明顶点位置
  gl_Position=vec4(position,0.,1.);
  // 声明待绘制点的大小
  gl_PointSize=10.;
  
  v_Uv=a_Uv
}

// 片元着色器
// 设置浮点数精度为中等精度
precision mediump float;
// 接收顶点着色器传递过来的uv值
varying vec2 v_Uv;
// 接收JavaScript传递过来的纹理
uniform sampler2D texture;
void main(){
  // 提起纹理对应uv坐标上的颜色，赋值给当前片元（像素）
  gl_FragColor=texture2D(texture,vec2(v_Uv.x,v_Uv.y));
}

