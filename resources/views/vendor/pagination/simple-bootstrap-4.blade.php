@if ($paginator->hasPages())
    <nav>
        <ul class="pagination justify-content-center">
            {{-- Previous Page Link --}}
            @if ($paginator->onFirstPage())
                <li class="page-item disabled" aria-disabled="true">
                    <span class="page-link bg-light text-muted border-0 px-4 py-2 rounded-pill">Previous</span>
                </li>
            @else
                <li class="page-item">
                    <a class="page-link border-0 px-4 py-2 rounded-pill shadow-sm" href="{{ $paginator->previousPageUrl() }}" rel="prev">Previous</a>
                </li>
            @endif

            {{-- Next Page Link --}}
            @if ($paginator->hasMorePages())
                <li class="page-item">
                    <a class="page-link border-0 px-4 py-2 rounded-pill shadow-sm ms-2" href="{{ $paginator->nextPageUrl() }}" rel="next">Next</a>
                </li>
            @else
                <li class="page-item disabled" aria-disabled="true">
                    <span class="page-link bg-light text-muted border-0 px-4 py-2 rounded-pill ms-2">Next</span>
                </li>
            @endif
        </ul>
    </nav>
@endif

