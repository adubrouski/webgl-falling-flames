class BufferUtils {
  static createAndBindBuffer(ctx, data, usage, attribLocation, size = 1) {
    const buffer = ctx.createBuffer();

    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, data, usage);
    ctx.vertexAttribPointer(attribLocation, size, ctx.FLOAT, false, 0, 0);
    ctx.enableVertexAttribArray(attribLocation);

    return buffer;
  }

  static updateBuffer(ctx, buffer, data) {
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
    ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, data);
  }
}

export { BufferUtils };
