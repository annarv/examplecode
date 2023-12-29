import { onScopeDispose, watchEffect } from 'vue';
import { Ref, ref } from 'vue';

export function useApiMappedCache<TEntiy>(
  loader: (entityId: string) => Promise<MaybeError<TEntiy>>,
  limit: number = 10,
): ApiMappedCache<TEntiy> {
  const _limit = limit < 2 ? 10 : limit;
  const _cids = ref(<string[]>[]);
  const _cache = new Map<string, Ref<TEntiy | null>>();

  const get = (entityId: string) => {
    if (!_cache.has(entityId)) {
      _cache.set(entityId, ref(null));
      _cids.value.push(entityId);
    }

    if (_cache.size > _limit) {
      _cache.delete(_cache.keys().next().value);
    }

    return _cache.get(entityId)!;
  };

  onScopeDispose(() => {
    _cache.clear();
  });

  watchEffect(() => {
    const ids = _cids.value;
    if (ids.length == 0) return;
    ids.forEach(async (id) => {
      var val = _cache.get(id)!;
      const res = await loader(id);
      if (!res.errors)
        val.value = res;
    });
    _cids.value.length = 0;
  });

  return {
    clear: () => _cache.clear(),
    get,
  };
}

export interface ApiMappedCache<TEntity> {
  clear(): void;
  get(entityId: string): Ref<TEntity | null>;
}
