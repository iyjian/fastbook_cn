# 计划：

1. 对原文进行段落的抽取，并记录相应的章节，段落编号，段落内容，具体记录格式如下


| 章节号 | 段落在原文的行数 | 原文 | 自动翻译内容1 |  自动翻译内容2 | 人工翻译结果 | 是否校对 | 校对时间 | 原文抓取时间 | 上次翻译时间 | 段落的变动内容 |
| -- |  -- |  -- |  -- |  -- |  -- |  -- |  -- |  -- |  -- |  -- | 
| 01 |  1 |  How can pretrained models help? |  预训练模型如何提供帮助？ |  预先训练的型号如何提供帮助？ |  预训练模型有什么用？ |  否 |  2020-09-01 |  2020-09-01 |  暂无 | 


2. 定期和原文比对，如果段落有增加，则增加相应的数据，如果段落有修改（修改的定义为，新段落和原段落有80%以上的相似度），相似度算法另行定义，则把新的内容以及变动的内容更新到原段落。


3. 未进行机器翻译的内容用机器自动翻译，人工只能翻译机器翻译过的内容，人工翻译后如果原文有改动，则根据改动的时间以及翻译的时间提示重新进行人工翻译。


4. 翻译界面：可以按照机器已经翻译，但是人工未翻译以及人工已翻译，原文段落已改动来展示未翻译的内容。

5. 校对界面：将人工已翻译，且原文抓取时间 < 翻译时间的内容展示用于校对。


# 备注

## 谷歌翻译事项

价格说明：https://cloud.google.com/translate/pricing

前50万个字符 免费
50万以上到10亿个字符 每百万字符20美金

其中只要发送给谷歌翻译的字符都算计费字符，所以可以考虑将字符尽可能的缩减一下。

**此项目自动翻译所需api秘钥请在trillium中搜索@project=fastai.translate**

### 账单查看地址
https://console.cloud.google.com/apis/api/translate.googleapis.com/overview?project=fastai-translate

谷歌翻译包括
+ Cloud Translation 基本版 v2
+ Cloud Translation 高级版 v3 
高级版自定义功能包括术语表、批量翻译和模型选择


### 基本版使用示例

```bash
curl -s -X POST -H "Content-Type: application/json" \
    -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
    --data "{
  'q': 'The Great Pyramid of Giza (also known as the Pyramid of Khufu or the
        Pyramid of Cheops) is the oldest and largest of the three pyramids in
        the Giza pyramid complex.',
  'source': 'en',
  'target': 'es',
  'format': 'text'
}" "https://translation.googleapis.com/language/translate/v2"
```

### 客户端使用指南(nodejs)

```bash
npm install --save @google-cloud/translate

```