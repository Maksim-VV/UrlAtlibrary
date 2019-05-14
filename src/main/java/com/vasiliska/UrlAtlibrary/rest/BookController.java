package com.vasiliska.UrlAtlibrary.rest;

import com.vasiliska.UrlAtlibrary.service.BookServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class BookController {

    private final BookServiceImpl bookService;

    @Autowired
    public BookController(BookServiceImpl bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/username")
    public String getUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userDetails.getUsername();
    }

    @GetMapping("/api/v1/books")
    public List<BookDto> getAll() {
        return bookService.showAllBooks().stream().map(BookDto::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/api/v1/books/{bookId}")
    public BookDto getById(@PathVariable("bookId") Long bookId) {
        return BookDto.toDto(bookService.bookByName(bookService.getBookByBookId(bookId)));
    }

    @DeleteMapping("/api/v1/books/{bookId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteById(@PathVariable("bookId") Long bookId) {
        bookService.delBook(bookService.getBookByBookId(bookId));
    }

    @PostMapping("/api/v1/books")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public void save(@RequestBody BookDto bookDto) {
        bookService.addNewBook(bookDto.getBookName(), bookDto.getAuthorName(), bookDto.getGenreName());
    }

    @PutMapping("/api/v1/books/{bookId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void update(@PathVariable("bookId") Long bookId, @RequestBody BookDto bookDto) {
        bookService.updateBookNameById(bookId, bookDto.getBookName());
    }

}
