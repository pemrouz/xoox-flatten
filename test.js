const { emitterify } = require('utilise/pure')
    , { map, until, transform } = require('xoox')
    , observable = require('xoox/observable')
    , { test } = require('tap')
    // suprise: the transform function is also the flatten operator!
    , flatten = require('./')
    , interval = (ms, i = 0) => observable(chan => {
        const timer = setInterval(() => chan.next(i++), ms)
        return () => clearInterval(timer)
      })

test('should flatten arrays', async ({ same, plan }) => {
  plan(1)
  same(
    transform(
      'hi'
    , map(char => transform(
        [10, 20, 30]
      , map(num => char + num)
      ))
    , flatten
    , []
    )
    ['h10', 'h20', 'h30', 'i10', 'i20', 'i30']
  )
})

test('should flatten stream of streams', async ({ same, plan }) => {
  plan(1)
  const el = emitterify({})
      
  const results = transform(el.on('click'), [])(
    map(() => interval(100))
  , flatten
  , until(9)
  )

  el.emit('click')
  el.emit('click')
  el.emit('click')
  same(await results, [0,0,0,1,1,1,2,2,2])
})