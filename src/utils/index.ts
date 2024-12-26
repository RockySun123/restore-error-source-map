import axios from 'axios'
import sourceMap from 'source-map-js'
//获取source-map 因为source-map 不会部署到线上环境，是部署在自己的服务器，所以需要axios
const getSourceMap = async (url: string) => {
  try {
    const res = await axios.get(url)
    return res.data
  } catch (err) {
    console.log('获取source-map失败', err)
  }
}
//将抛出的错误和 source-map 关联
const findCodeBySourceMap = async (stackFrame: Record<string, any>) => {
  //获取map文件,拿到 source-map 文件内容
  const fileContent = await getSourceMap(stackFrame.fileName + '.map')
  //解析 source-map
  const consumer = await new sourceMap.SourceMapConsumer(fileContent)

  //通过报错的位置查找源文件的名称以及报错行数
  const originalPosition = consumer.originalPositionFor({
    line: stackFrame.lineNumber,
    column: stackFrame.columnNumber || 0
  })

  //真实源文件错误代码
  const code = consumer.sourceContentFor(originalPosition.source)

  console.log(code, '还原之后的代码')
}

export { findCodeBySourceMap }
